import { useState, useEffect } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
function Form() {
  const [errors, setErrors] = useState({ teamCountError: false });
  const [teamErrors, SetTeamErrors] = useState([]);
  const [page, setPage] = useState(0);
  const [teamCount, SetTeamCount] = useState(0);
  const [teamInfo, SetTeamInfo] = useState([]);
  const [draftStandings, SetDraftStandings] = useState([]);
  const [currPick, SetCurrPick] = useState(4);
  const [draftTable, SetDraftTable] = useState([]);

  const HandleBegin = () => {
    let tempArray = [];
    if (teamCount < 4) {
      setErrors({ teamCountError: true });
      return;
    }
    let tempTeamErrors = [];
    for (let i = 0; i < teamCount; i++) {
      tempArray.push({
        id: i + 1,
        name: "",
        image: "",
        weight: 0,
      });
      tempTeamErrors.push({
        nameError: false,
        percentageError: false,
        logoError: false,
      });
    }
    SetTeamErrors(tempTeamErrors);
    SetTeamInfo(tempArray);
    setPage(1);
    console.log("begin!");
  };
  const HandleName = (newName, index) => {
    let tempArray = [...teamInfo];
    let team = { ...tempArray[index] };
    team.name = newName;
    tempArray[index] = team;
    SetTeamInfo(tempArray);
    console.log("updating name");
  };
  const HandleWeight = (newWeight, index) => {
    let tempArray = [...teamInfo];
    let team = { ...tempArray[index] };
    team.weight = parseInt(newWeight);
    if (isNaN(team.weight)) {
      team.weight = 0;
    }
    tempArray[index] = team;
    SetTeamInfo(tempArray);
    console.log(newWeight);
  };
  const HandleImage = (newImage, index) => {
    let tempArray = [...teamInfo];
    let team = { ...tempArray[index] };
    team.image = newImage;
    tempArray[index] = team;
    SetTeamInfo(tempArray);
    console.log(tempArray);
  };
  const HandleFile = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      console.log("e.target.result", e.target.result);
      let gameFile = JSON.parse(e.target.result);
      SetTeamInfo(gameFile);
      SetTeamCount(gameFile.length);
      setPage(1);
    };
  };

  const HandleGenerate = () => {
    let rwc = require("random-weighted-choice");
    //do this for first 4 picks then rest is decided by original weight
    let tempTeamInfo = [...teamInfo];
    let tempStandings = [];
    let hasError = false;

    let tempTeamErrors = [...teamErrors];
    for (let i = 0; i < teamCount; i++) {
      let tempTeam = { ...teamErrors[i] };

      if (teamInfo[i].name == "") {
        tempTeam.nameError = true;
        hasError = true;
      } else {
        tempTeam.nameError = false;
      }
      if (teamInfo[i].weight > 100 || teamInfo[i] < 0) {
        tempTeam.percentageError = true;
        hasError = true;
      } else {
        tempTeam.percentageError = false;
      }
      tempTeamErrors[i] = tempTeam;
    }
    SetTeamErrors(tempTeamErrors);
    console.log(tempTeamErrors);
    if (hasError) {
      return;
    }
    for (let i = 0; i < 3; i++) {
      let choice = parseInt(rwc(tempTeamInfo));
      tempStandings.push({
        id: choice,
        standing: i + 1,
      });
      tempTeamInfo[choice - 1] = { id: -1, weight: 0 };
    }
    tempTeamInfo.sort((a, b) => {
      if (a.weight < b.weight) {
        return 1;
      } else {
        return -1;
      }
    });
    let standing = 3;
    console.log(tempTeamInfo);
    for (let i = 0; i < teamCount; i++) {
      console.log("im in");
      if (tempTeamInfo[i].id != -1) {
        console.log("adding");
        tempStandings.push({
          id: tempTeamInfo[i].id,
          standing: standing + 1,
        });
        standing++;
      }
    }
    console.log("generating");
    SetDraftStandings(tempStandings);
    setPage(3);
  };

  const HandleNextPick = () => {
    let tempDraftTable = [...draftTable];
    tempDraftTable.push({
      standing: draftStandings[currPick - 1].standing,
      name: teamInfo[draftStandings[currPick - 1].id - 1].name,
      image: teamInfo[draftStandings[currPick - 1].id - 1].image,
    });
    SetDraftTable(tempDraftTable);
    if (currPick == 1) {
      //show final standings
      tempDraftTable.push({
        standing: draftStandings[currPick].standing,
        name: teamInfo[draftStandings[currPick].id - 1].name,
        image: teamInfo[draftStandings[currPick].id - 1].image,
      });
      setPage(4);
    } else {
      SetCurrPick(currPick - 1);
    }
  };

  if (page === 0) {
    return (
      <div className="card mb-3 p-3 border container">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon3">
              Number of Teams
            </span>
          </div>
          <input
            type="number"
            placeholder="0"
            className="form-control"
            aria-describedby="basic-addon3"
            onChange={(event) => SetTeamCount(event.target.value)}
          ></input>
        </div>
        <div className="row">
          <label
            style={{ visibility: errors.teamCountError ? "visible" : "hidden" }}
            className="text-danger pl-3"
          >
            Please enter a number greater than four
          </label>
        </div>
        <div className="row">
          <div className="col"></div>
          <div className="col text-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={HandleBegin}
            >
              Begin!
            </button>
          </div>
          <div className="col">
            <h5>Upload Saved Game</h5>
            <input
              className="float-right"
              type="file"
              onChange={(e) => HandleFile(e)}
            ></input>
          </div>
        </div>
      </div>
    );
  } else if (page === 1) {
    console.log(teamCount);
    return (
      <div className="card mb-3 p-4 border container">
        {teamInfo.map((team) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 1, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="card shadow mb-3"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.1 }}
            >
              <div className="row p-3">
                <div className="col">
                  <h3 className="float-left">Team #{team.id}</h3>
                </div>
                <div className="col">
                  <div className="row">
                    <h3 className="float-left">Name</h3>
                  </div>
                  <div className="row">
                    <input
                      className="float-left"
                      type="text"
                      value={team.name}
                      onChange={(event) =>
                        HandleName(event.target.value, team.id - 1)
                      }
                    ></input>
                  </div>
                  <div className="row">
                    <p
                      style={{
                        visibility: teamErrors[team.id - 1].nameError
                          ? "visible"
                          : "hidden",
                      }}
                      className="text-danger text-center"
                    >
                      Please enter valid team <br />
                      name
                    </p>
                  </div>
                </div>
                <div className="col">
                  <div className="row">
                    <h3 className="float-left">Percentage (%)</h3>
                  </div>
                  <div className="row">
                    <input
                      className="float-left"
                      type="text"
                      value={team.weight}
                      onChange={(event) =>
                        HandleWeight(event.target.value, team.id - 1)
                      }
                    ></input>
                  </div>
                  <div className="row">
                    <label
                      style={{
                        visibility: teamErrors[team.id - 1].percentageError
                          ? "visible"
                          : "hidden",
                      }}
                      className="text-danger"
                    >
                      Please enter a number between 0-100
                    </label>
                  </div>
                </div>
                <div className="col">
                  <div className="row">
                    <h3 className="float-left">Image (URL)</h3>
                  </div>
                  <div className="row">
                    <input
                      className="float-left"
                      type="text"
                      value={team.image}
                      onChange={(event) =>
                        HandleImage(event.target.value, team.id - 1)
                      }
                    ></input>
                  </div>
                </div>
                <div className="col">
                  <div className="row">
                    <h3 className="float-left">Preview</h3>
                  </div>
                  <div className="row">
                    <img
                      src={team.image}
                      className="float-left img-thumbnail"
                    ></img>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
        <div className="row">
          <div className="col"></div>
          <div className="col text-center">
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={HandleGenerate}
            >
              Generate!
            </button>
          </div>
          <div className="col text-center">
            <a
              href="#"
              className="float-right btn btn-secondary mt-3"
              id="link"
              download="DraftLotterySave.json"
              href={
                "data:application/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(teamInfo))
              }
            >
              Download as JSON
            </a>
          </div>
        </div>
      </div>
    );
  } else if (page === 3) {
    const draftCardVariants = {
      hidden: {
        opacity: 0,
        scale: 0.6,
        transition: {
          duration: 0.5,
        },
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.5,
          delay: 1,
        },
      },
    };
    return (
      <div className="card mb-3 p-3 border container text-center">
        <div className="row">
          <div className="col">
            <h1>#{currPick} Draft Pick</h1>
            <AnimatePresence>
              <motion.div
                key={currPick}
                className="card shadow container"
                id="draftPickCard"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={draftCardVariants}
              >
                <img
                  className="image-thumnail img-responsive p-2"
                  src={teamInfo[draftStandings[currPick - 1].id - 1].image}
                ></img>
                <div className="card-body">
                  <h2 className="card-title">
                    {teamInfo[draftStandings[currPick - 1].id - 1].name}
                  </h2>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="col">
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Logo</th>
                  <th scope="col">Name</th>
                </tr>
              </thead>
              <tbody>
                {draftTable.map((draftTeam) => (
                  <motion.tr
                    initial={{
                      opacity: 0,
                      scale: 0.6,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{ duration: 0.5 }}
                    exit={{
                      opacity: 0,
                    }}
                    key={draftTeam.standing}
                  >
                    <th scope="row">
                      <h3>{draftTeam.standing}</h3>
                    </th>
                    <td className="w-25">
                      <img
                        className="img-fluid image-thumnail p-2 w-50"
                        src={draftTeam.image}
                      ></img>
                    </td>
                    <td>
                      <h3 className="float-left">{draftTeam.name}</h3>
                    </td>
                    <td></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={() => HandleNextPick()}
        >
          {currPick == 1 ? "Final Standings" : "Next"}
        </button>
      </div>
    );
  } else if (page == 4) {
    console.log(draftStandings);
    console.log(teamInfo);
    return (
      <div className="card mb-3 p-3 border container-fluid text-center">
        <div className="row"></div>
        <div className="col">
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Logo</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              {draftStandings.map((draftTeam) => (
                <motion.tr
                  initial={{
                    opacity: 0,
                    scale: 0.6,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{ duration: 0.5 }}
                  exit="hidden"
                  key={teamInfo[draftTeam.id - 1].id}
                >
                  <th scope="row">
                    <h1>{draftTeam.standing}</h1>
                  </th>
                  <td className="w-25">
                    <img
                      className="img-fluid image-thumnail w-25"
                      src={teamInfo[draftTeam.id - 1].image}
                    ></img>
                  </td>
                  <td>
                    <h2>{teamInfo[draftTeam.id - 1].name}</h2>
                  </td>
                  <td></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Form;
