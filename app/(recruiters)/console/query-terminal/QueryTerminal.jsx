'use client'

import React from "react";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/popover";
import {Slider} from "@nextui-org/slider";
import {Tooltip} from "@nextui-org/tooltip";
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ApplicantsTable from "./ApplicantsTable";
import ApplicantCard from "./ApplicantCard";
import { Divider } from "@nextui-org/react";

export default function QueryTerminal({
    applicantIDs,
    setApplicantIDs,
    tableInfo,
    setTableInfo,
    isLoading,
    setIsLoading,
    searchSettings,
    setSearchSettings,
    loadingColor,
    setLoadingColor,
    loadingText,
    setLoadingText,
    queryText,
    setQueryText,
    emptyContent,
    setEmptyContent,
    displayCard,
    setDisplayCard,
    cardID,
    setCardID,
    cardScore,
    setCardScore,
    TopK,
    setTopK,
    initialMultiplier,
    setInitialMultiplier,
    regularMultiplier,
    setRegularMultiplier,
    weightedAverage,
    setWeightedAverage,
    mainWeight,
    setMainWeight,
    educationWeight,
    setEducationWeight,
    experienceWeight,
    setExperienceWeight,
    projectsWeight,
    setProjectsWeight,
  }) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-initial pb-unit-2">
          <div className="bg-default-50 flex items-center rounded-xl px-unit-2 py-unit-3 h-full">
            <div className="flex-auto px-unit-1">
              <Input label={null} size="sm" placeholder="Enter a query..." classNames={{inputWrapper: "h-10"}} value={queryText} onValueChange={(value) => setQueryText(value)}/>
            </div>
            <div className="flex-initial px-unit-1">
              <Button
                color="success"
                size="md"
                startContent={<SearchIcon />}
                onPress={async () => {
                  if (queryText === "" || isLoading) {
                    return;
                  }
                  setEmptyContent(" ");
                  setIsLoading(true);
                  setLoadingColor("success");
                  setLoadingText("Searching...");
                  try {
                    const data = {
                      queryText: queryText,
                      searchSettings: searchSettings,
                      previousApplicants: applicantIDs,
                    }
                    const searchResponse = await fetch("/api/search", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(data)
                    })
                    const searchResponseData = await searchResponse.json();
                    if (searchResponseData.status === 200) {
                      if (applicantIDs.length === 0) {
                        const getInfoResponse = await fetch("/api/get-info", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify({ids: searchResponseData.filteredTopApplicants})
                        })
                        const getInfoResponseData = await getInfoResponse.json();
                        if (getInfoResponseData.status === 200) {
                          setApplicantIDs(searchResponseData.filteredTopApplicants);
                          setTableInfo(getInfoResponseData.tableInfo);
                          setQueryText("");
                          setIsLoading(false);
                        } else if (getInfoResponseData.status === 500) {
                          console.error(getInfoResponseData.message);
                        } else {
                          console.error("Unknown error");
                        }
                      } else {
                        setApplicantIDs(searchResponseData.filteredTopApplicants);
                        setTableInfo(searchResponseData.filteredTopApplicants.reduce((acc, val) => {
                          acc[val.id] = tableInfo[val.id];
                          return acc;
                        }, {}));
                        setQueryText("");
                        setIsLoading(false);
                      }
                    } else if (searchResponseData.status === 500) {
                      console.error(searchResponseData.message);
                    } else {
                      console.error("Unknown error");
                    }
                    setIsLoading(false);
                    setEmptyContent("No applicants found");
                  } catch (error) {
                    console.error(error);
                    setIsLoading(false);
                    setEmptyContent("No applicants found");
                  }
                }}
              >
                Search
              </Button>
            </div>
            <div className="flex-initial px-unit-1">
              <Tooltip content="Flash Rank (Fast)" color={"primary"} delay={400} closeDelay={600}>
                <Button
                  isIconOnly
                  color="primary"
                  size="md"
                  onPress={async () => {
                    if (queryText === "" || isLoading) {
                      return;
                    }
                    setEmptyContent(" ");
                    setIsLoading(true);
                    setLoadingColor("primary");
                    setLoadingText("Ranking Applicants...");
                    try {
                      const data = {
                        queryText: queryText,
                        searchSettings: searchSettings,
                        previousApplicants: applicantIDs,
                      }
                      const flashRankResponse = await fetch("/api/flash-rank", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                      })
                      const flashRankResponseData = await flashRankResponse.json();
                      if (flashRankResponseData.status === 200) {
                        if (applicantIDs.length === 0) {
                          const getInfoResponse = await fetch("/api/get-info", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ids: flashRankResponseData.topApplicants})
                          })
                          const getInfoResponseData = await getInfoResponse.json();
                          if (getInfoResponseData.status === 200) {
                            setApplicantIDs(flashRankResponseData.topApplicants);
                            setTableInfo(getInfoResponseData.tableInfo);
                            setQueryText("");
                            setIsLoading(false);
                          } else if (getInfoResponseData.status === 500) {
                            console.error(getInfoResponseData.message);
                          } else {
                            console.error("Unknown error");
                          }
                        } else {
                          setApplicantIDs(flashRankResponseData.topApplicants);
                          setTableInfo(flashRankResponseData.topApplicants.reduce((acc, val) => {
                            acc[val.id] = tableInfo[val.id];
                            return acc;
                          }, {}));
                          setQueryText("");
                          setIsLoading(false);
                        }
                      } else if (flashRankResponseData.status === 500) {
                        console.error(flashRankResponseData.message);
                      } else {
                        console.error("Unknown error");
                      }
                      setIsLoading(false);
                      setEmptyContent("No applicants found");
                    } catch (error) {
                      console.error(error);
                      setIsLoading(false);
                      setEmptyContent("No applicants found");
                    }
                  }}

                >
                  <BoltIcon />
                </Button>
              </Tooltip>
            </div>
            <div className="flex-initial px-unit-1">
              <Tooltip content="Hand-pick (Slow)" color={"danger"} delay={400} closeDelay={600}>
                <Button
                  isIconOnly
                  color="danger"
                  size="md"
                  onPress={async () => {
                    if (queryText === "" || isLoading) {
                      return;
                    }
                    setEmptyContent(" ");
                    setIsLoading(true);
                    setLoadingColor("danger");
                    setLoadingText("Filtering Applicants...");
                    try {
                      const data = {
                        queryText: queryText,
                        searchSettings: searchSettings,
                        previousApplicants: applicantIDs,
                      }
                      const handPickResponse = await fetch("/api/hand-pick", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                      })
                      const handPickResponseData = await handPickResponse.json();
                      if (handPickResponseData.status === 200) {
                        if (applicantIDs.length === 0) {
                          const getInfoResponse = await fetch("/api/get-info", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ids: handPickResponseData.filteredApplicants})
                          })
                          const getInfoResponseData = await getInfoResponse.json();
                          if (getInfoResponseData.status === 200) {
                            setApplicantIDs(handPickResponseData.topApplicants);
                            setTableInfo(getInfoResponseData.tableInfo);
                            setQueryText("");
                            setIsLoading(false);
                          } else if (getInfoResponseData.status === 500) {
                            console.error(getInfoResponseData.message);
                          } else {
                            console.error("Unknown error");
                          }
                        } else {
                          setApplicantIDs(handPickResponseData.filteredApplicants);
                          setTableInfo(handPickResponseData.filteredApplicants.reduce((acc, val) => {
                            acc[val.id] = tableInfo[val.id];
                            return acc;
                          }, {}));
                          setQueryText("");
                          setIsLoading(false);
                        }
                      } else if (handPickResponseData.status === 500) {
                        console.error(handPickResponseData.message);
                      } else {
                        console.error("Unknown error");
                      }
                      setIsLoading(false);
                      setEmptyContent("No applicants found");
                    } catch (error) {
                      console.error(error);
                      setIsLoading(false);
                      setEmptyContent("No applicants found");
                    }
                  }}
                >
                  <FilterAltOutlinedIcon />
                </Button>
              </Tooltip>
            </div>
            <div className="flex-initial px-unit-1">
              <Tooltip content="Save Query" color={"secondary"} delay={400} closeDelay={600}>
                <Button isIconOnly color="secondary" size="md"><BookmarkBorderIcon /></Button>
              </Tooltip>
            </div>
            <div className="flex-initial px-unit-1">
              <Popover placement="bottom">
                <PopoverTrigger>
                  <Button isIconOnly color="secondary" size="md">
                    <Tooltip content="Settings" color={"secondary"} delay={400} closeDelay={600}>
                      <SettingsOutlinedIcon />
                    </Tooltip>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-2 py-2 w-[33vw]">
                    <div className="flex flex-col gap-3">
                      <div className="text-2xl font-bold">Settings</div>
                      <Divider />
                      <div className= "flex gap-3">
                        <Input type="number" label="TopK" placeholder="10" value={TopK} onValueChange={(value) => setTopK(value)}/>
                        <Input type="number" label="Initial Multiplier" placeholder="2" value={initialMultiplier} onValueChange={(value) => setInitialMultiplier(value)}/>
                        <Input type="number" label="Regular Multiplier" placeholder="2" value={regularMultiplier} onValueChange={(value) => setRegularMultiplier(value)}/>
                      </div>
                      <Divider />
                      <Slider 
                        label="Weighted Average" 
                        step={0.01} 
                        value={weightedAverage}
                        onChangeEnd={(value) => setWeightedAverage(value)}
                        maxValue={1} 
                        minValue={0} 
                        defaultValue={0.5}
                        className="max-w-md"
                        color="foreground"
                        startContent="Old"
                        endContent="New"
                      />
                      <Divider />
                      <Slider 
                        label="Main Weight" 
                        step={0.01} 
                        value={mainWeight}
                        onChangeEnd={(value) => setMainWeight(value)}
                        maxValue={1} 
                        minValue={0} 
                        defaultValue={0.9}
                        className="max-w-md"
                        color="primary"
                      />
                      <Slider 
                        label="Education Weight" 
                        step={0.01} 
                        value={educationWeight}
                        onChangeEnd={(value) => setEducationWeight(value)}
                        maxValue={1} 
                        minValue={0} 
                        defaultValue={0.4}
                        className="max-w-md"
                        color="success"
                      />
                      <Slider 
                        label="Experience Weight" 
                        step={0.01} 
                        value={experienceWeight}
                        onChangeEnd={(value) => setExperienceWeight(value)}
                        maxValue={1} 
                        minValue={0} 
                        defaultValue={0.7}
                        className="max-w-md"
                        color="secondary"
                      />
                      <Slider 
                        label="Projects Weight" 
                        step={0.01} 
                        value={projectsWeight}
                        onChangeEnd={(value) => setProjectsWeight(value)}
                        maxValue={1} 
                        minValue={0} 
                        defaultValue={0.1}
                        className="max-w-md"
                        color="warning"
                      />
                      <Divider />
                      <div className="flex gap-3">
                        <div className="flex-auto">
                          
                        </div>
                        <Tooltip content="Reset to last saved settings" color={"danger"} delay={400} closeDelay={600}>
                          <Button
                            className="flex-initial"
                            color="danger"
                            variant="light"
                            onPress={() => {
                              setTopK(searchSettings.topK);
                              setInitialMultiplier(searchSettings.multipliers.firstTopKMultiplier);
                              setRegularMultiplier(searchSettings.multipliers.regularTopKMultiplier);
                              setWeightedAverage(searchSettings.weights.newWeight);
                              setMainWeight(searchSettings.weights.mainWeight);
                              setEducationWeight(searchSettings.weights.educationWeight);
                              setExperienceWeight(searchSettings.weights.experienceWeight);
                              setProjectsWeight(searchSettings.weights.projectsWeight);
                            }}
                          >
                            Reset
                          </Button>
                        </Tooltip>
                        <Tooltip content="Save settings" color={"secondary"} delay={400} closeDelay={600}>
                          <Button
                            className="flex-initial"
                            color="secondary"
                            onPress={async () => {
                              const searchSettings = {
                                topK: TopK,
                                multipliers: {
                                  firstTopKMultiplier: initialMultiplier,
                                  regularTopKMultiplier: regularMultiplier
                                },
                                weights: {
                                  mainWeight: mainWeight,
                                  educationWeight: educationWeight,
                                  experienceWeight: experienceWeight,
                                  projectsWeight: projectsWeight,
                                  oldWeight: 1 - weightedAverage,
                                  newWeight: weightedAverage
                                }
                              }
                              setSearchSettings(searchSettings);
                              await fetch("/api/save-search-settings", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify(searchSettings)
                              });
                            }}
                          >
                            Save
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="flex-auto flex h-full">
          <div className="flex-[72_1_0%] pr-unit-2 pt-unit-2">
            <div className="flex flex-col bg-default-50 rounded-xl h-full p-unit-3">
              <ApplicantsTable applicantIDs={applicantIDs} tableInfo={tableInfo} loadingColor={loadingColor} loadingText={loadingText} isLoading={isLoading} setIsLoading={setIsLoading} emptyContent={emptyContent} setDisplayCard={setDisplayCard} setCardID={setCardID} setCardScore={setCardScore} />
            </div>
          </div>
          <div className="flex-[28_1_0%] pl-unit-2 pt-unit-2">
            <div className="bg-default-50 rounded-xl h-full p-unit-3">
              <ApplicantCard displayCard={displayCard} cardID={cardID} tableInfo={tableInfo} cardScore={cardScore} />
            </div>
          </div>
        </div>
      </div>
    )
  }