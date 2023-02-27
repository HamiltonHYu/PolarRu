import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const modalStyle = {
  top: "50%",
  left: "50%",
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "10px",
  },
}));

export default function PollsHistoryDisplay(props) {
  const classes = useStyles();
  const [style] = React.useState(modalStyle);
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    method,
    question,
    creatorId,
    pollId,
    voteCount,
    responses,
    winner,
    active,
  } = props;
  console.log("responses", responses);

  const responsesDisplay = responses.map((res, i) => (
    <p key={i}>
      {res.userId} voted for {res.vote}
    </p>
  ));

  const body = (
    <div style={style} className={classes.paper}>
      <h2>Poll #{pollId}</h2>
      <p>Created By {creatorId}</p>
      <p>Evaluated with the {method} method</p>
      <p>Total Votes: {voteCount}</p>
      <h3 id="simple-modal-title">{question}</h3>
      <p>
        {winner.option} was the most voted for choice with {winner.count} votes
      </p>
      <div>{responsesDisplay}</div>
      <p>This is a(n) {active ? "open" : "closed"} poll</p>
    </div>
  );

  return (
    <div className="pollsHistoryDisplay">
      <div className="pollsHistoryDisplayContents">
        <h3>{question}</h3>
        <p>
          {winner.option} was the most voted for choice with
          {(" "+winner.count)} votes
        </p>
        <Button
          onClick={() => {
            history.push(`/poll/${props.pollId}`);
          }}
          variant="contained"
        >
          Take me to this poll
        </Button>
      </div>
    </div>
  );
}
