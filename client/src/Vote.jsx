import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Graph from "./Graph.jsx";
import ChatBox from "./Chatbox";
import EmojiPicker from "emoji-picker-react";

import {
  Button,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import pollSocket from "./PollSocket.js";
import * as ENV from "./env";

const randomID = Math.floor(Math.random() * 1000000);

const Vote = (props) => {
  let [state, setState] = useState(null);
  const [selected, setSelected] = useState(-1);
  // const [graphData, setgraphData] = useState(null);
  // copy to clipboard functionality
  const textAreaRef = useRef(null);
  const history = useHistory();
  const pollId = props.match.params.pollId;

  console.log(state);

  useEffect(() => {
    if (!props.userId) return;

    if (state === null) {
      const listener = async (type, data) => {
        if (data.pollId != pollId) return;
        console.log("Got event: ", type, data);

        if (type === "subscribe") {
          console.log("in subscribe");

          state = { poll: data, vote: { voted: false, count: data.voteCount } };
          setState({ ...state });
        } else if (type === "joined") {
          if (state.poll.joined.findIndex((id) => id == data.userId) === -1) {
            state.poll.joined.push(data.userId);
          }
          setState({ ...state });
        } else if (type === "vote_update") {
          console.log(data);
          state.vote.count = data.voteCount;
          state.poll.responses.push(data.vote);
          setState({ ...state });
          // const data = await fetch(ENV.API_URL + "/poll/" + pollId);
          // const json = await data.json();
          // console.log("graph data");
          // console.log(json);
          // setGraphData(json);
        } else if (type === "voted") {
          state.vote.count = data.voteCount;
          state.vote.voted = true;
          state.poll.responses.push(data.vote);
          setState({ ...state });
        } else if (type === "winner") {
          // route winner page
          alert(`Winner was ${data.winner.option}!`);
        }
      };

      function connect() {
        if (!pollSocket.connected) {
          pollSocket.connect().then(() => {
            pollSocket.addListener(listener);
            // pollSocket.sendEvent('subscribe', {userId:props.userId, pollId:pollId});
            pollSocket.sendEvent("subscribe", {
              userId: props.userId,
              pollId: pollId,
              guest: props.guest,
            });
          });
        } else {
          pollSocket.addListener(listener);
          pollSocket.sendEvent("subscribe", {
            userId: props.userId,
            pollId: pollId,
            guest: props.guest,
          });
        }
      }
      connect();
    }
  }, [props.userId]);

  if (!state) return <h3>Loading...</h3>;

  const pollOptions = state.poll.options.map((opt, i) => {
    return (
      <div key={i}>
        <FormControlLabel
          className="optionsLabel"
          key={`optKey${i}`}
          value={`${i}`}
          disabled={state.vote.voted || state.poll.voted}
          control={<Radio />}
          label={opt}
        />
      </div>
    );
  });

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
  }

  const voteParticipants = [];

  for (let i = 0; i < state.poll.joined.length; i += 1) {
    let found = false;
    for (let j = 0; j < state.poll.responses.length; j++) {
      if (state.poll.responses[j].userId === state.poll.joined[i]) {
        found = true;
        break;
      }
    }

    if (found) {
      // if they have, add div that says so
      voteParticipants.push(
        <div
          key={i}
          className="participantDiv"
        >{`${state.poll.joined[i]}`}</div>
      );
    } else {
      voteParticipants.push(
        <div
          key={i}
          className="participantDiv"
        >{`${state.poll.joined[i]}`}</div>
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex" }}>
        <div className="voteContainer">
          <h1>{state.poll.question}</h1>
          <div className="voteRow">
            <Box mb={3}>
              <FormControl>
                <RadioGroup
                  className="votingGroup"
                  name="voteRadioGroup"
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {pollOptions}
                </RadioGroup>
              </FormControl>
            </Box>
            <div className="participantContainer" style={{ padding: "1rem" }}>
              <p>
                <b>{state.vote.count} </b>votes counted
              </p>
              <p>
                <b>Participants:</b>
              </p>
              {voteParticipants}
            </div>
            {props.admin && <div className="linkContainer"></div>}
          </div>
          <div className="buttonDivLogin">
            <Button
              onClick={() => {
                pollSocket.sendEvent("vote", {
                  userId: props.userId,
                  pollId: props.match.params.pollId,
                  vote: selected,
                  guest: props.guest,
                });
              }}
              variant="contained"
              disabled={state.vote.voted || state.poll.voted || selected < 0}
            >
              <b>
                {state.vote.voted || state.poll.voted
                  ? "You already voted"
                  : "Vote"}
              </b>
            </Button>
            <Button
              variant="contained"
              onClick={() => history.push("/landing")}
            >
              Go Back
            </Button>

            {props.admin && (
              <Button
                onClick={() => {
                  pollSocket.sendEvent("close_poll", {
                    userId: props.userId,
                    pollId: props.pollId,
                  });
                  history.push("/landing");
                }}
                // disabled={!validateForm()}
                variant="contained"
              >
                <b>Close Poll</b>
              </Button>
            )}
          </div>
        </div>
        <div style={{ marginLeft: "1rem" }}></div>
        <Graph state={state} />
      </div>
      <div>
        <ChatBox {...props} />
        <button
          className="pollLink"
          style={{
            cursor: "pointer",
            border: "none",
            backgroundColor: "transparent",
          }}
          onClick={() => {
            navigator.clipboard.writeText(
              `http://localhost:3000/poll/${
                props.match.params.pollId || "testing"
              }`
            );
          }}
        >{`Poll Link:   http://localhost:3000/poll/${
          props.match.params.pollId || "testing"
        }`}</button>
        <div style={{ marginBottom: "12rem" }}></div>
      </div>
    </div>
  );
};

export default Vote;
