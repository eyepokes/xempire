import {after, all, claim, getHash, getPrice, getProfit, improve, tap} from "./xempire";
import {generateRandomNumber, sleep} from "./utils";
import {writeFile} from "fs/promises";
import {DateTime} from "luxon";

(async () => {
    const authTokens = [
        "key"
    ];

    const timeout = 15;
    const minTaps = 5;
    const maxTaps = 15;

    let jobs = [];
    for (const authToken of authTokens) {
        jobs.push(job(authToken));
    }

    Promise.allSettled(jobs);

    async function job(authToken: string) {
        try {
            while (true) {

                const {gameData, additionalGameData} = await getGameData();

                // claim offline reward
                await claimReward();

                // run clicker
                await clicker(gameData.hero.earns.task.energy, gameData.hero.earns.task.moneyPerTap);

                //run boost
                await boostProfile();


                console.log("Finished cycle, restarting in " + timeout + " seconds");
                await sleep(timeout);
            }


        } catch (e: any) {
            console.log(e);
            console.log("Update token");
        }

        async function getGameData() {
            let gameData = await all("{\"data\":{}}", authToken);

            if (!gameData) {
                throw new Error("cannot get game data");
            }

            let additionalGameData = await after("{\"data\":{\"lang\":\"ru\"}}", authToken);

            if (!additionalGameData) {
                throw new Error("cannot get game data");
            }

            return {gameData: gameData.data, additionalGameData: additionalGameData.data};
        }

        async function claimReward() {
            console.log(`Claiming offline reward`);
            let claimResponse = await claim("{}", authToken);

            if (!claimResponse) {
                throw new Error("cannot claim reward");
            }
        }

        async function clicker(energy: number, moneyPerTap: number) {
            console.log(`Running clicker`);
            let lastSendTappedDate;

            while (energy >= moneyPerTap) {
                let currentDate = Date.now();
                const seconds = lastSendTappedDate ? Math.ceil((currentDate - lastSendTappedDate) / 1e3) : 2;
                let amount = moneyPerTap * generateRandomNumber(minTaps, maxTaps);
                let tapResponse = await tap(JSON.stringify({
                    "data":
                        {
                            "data":
                                {
                                    "task":
                                        {
                                            amount,
                                            "currentEnergy": energy - amount
                                        }
                                },
                            seconds
                        }
                }), authToken);

                if (!tapResponse.success) {
                    throw new Error("cannot process a tap");
                }

                energy = tapResponse.data.hero.earns.task.energy;
                lastSendTappedDate = currentDate;
                await sleep(seconds);
            }
        }

        async function findBestSkillsToImprove() {
            const {gameData, additionalGameData} = await getGameData();
            //console.log(gameData, additionalGameData);
            const skills = additionalGameData.skills;
            const dbSkills = gameData.dbData.dbSkills;
            let availableToImprove: any[] = [];
            dbSkills.forEach((skill: any) => {
                let userSkillLevel = (skills[skill.key]?.level ?? 0) + 1;
                let price = getPrice(skill, userSkillLevel);
                let [hasLevelRequirements] = skill.levels.filter((item: any) => userSkillLevel === item.level);
                let userSkill = skills[skill.key];
                let notOnCoolDown = true;
                let notRequiredSkill = true;

                if (userSkill) {
                    if (userSkill.finishUpgradeDate) {
                        let finishUpgradeDate = DateTime.fromISO(userSkill.finishUpgradeDate.replace(" ", "T")).plus({hour: 3}).toUnixInteger();
                        if (DateTime.now().toUnixInteger() <= finishUpgradeDate) {
                            notOnCoolDown = false;
                        }
                    }
                }

                if (hasLevelRequirements) {
                    if (!Array.isArray(hasLevelRequirements.requiredSkills) && hasLevelRequirements.requiredSkills) {
                        let skillsRequired = Object.keys(hasLevelRequirements.requiredSkills);
                        if (skillsRequired.length > 0) {
                            for (let skillRequired of skillsRequired) {
                                if (!skills[skillRequired]) {
                                    notRequiredSkill = false;
                                } else if (skills[skillRequired].level < hasLevelRequirements.requiredSkills[skillRequired]) {
                                    notRequiredSkill = false;
                                }
                            }
                        }
                    }

                    if (hasLevelRequirements.requiredHeroLevel > gameData.hero.level) {
                        notRequiredSkill = false;
                    }
                }

                if (price <= gameData.hero.money && userSkillLevel <= skill.maxLevel && (hasLevelRequirements ? (gameData.hero.level >= hasLevelRequirements.requiredHeroLevel && gameData.profile.friends >= hasLevelRequirements.requiredFriends) : true) && notOnCoolDown && notRequiredSkill) {
                    let profit = getProfit(skill, userSkillLevel) - getProfit(skill, (userSkillLevel > 0 ? userSkillLevel - 1 : 0));
                    availableToImprove.push({...skill, price, userSkillLevel, profit});
                }
            });

            if (availableToImprove.length === 0) {
                return false;
            }

            //await writeFile("./temp/as.json", JSON.stringify(availableToImprove, null, 4));
            return availableToImprove.sort((a: any, b: any) => {
                if (a.profit < b.profit) {
                    return 1;
                } else if (a.profit > b.profit) {
                    return -1;
                }
                return 0;
            });
        }

        async function boostProfile() {
            console.log(`Improving skills`);
            let skillsToImprove = await findBestSkillsToImprove();

            if (!skillsToImprove) {
                return;
            }

            for (let skill of skillsToImprove) {
                let improveResponse = await improve("{\"data\":\"" + skill.key + "\"}", authToken);
                if (!improveResponse) {
                    continue;
                }
                if (!improveResponse.success) {
                    console.log("cannot process an improvement: " + improveResponse.error);
                } else {
                    console.log(`Improved ${skill.title} skill`);
                }
                await sleep(1);
            }
        }
    }

    /*let time = 1724076527;
    let hash = getHash(time, "{\"data\":{\"lang\":\"ru\"}}");
    console.log(time, hash, "should be", "e77bab19faa2c81258c2b7e0c187e52e");*/
})();
