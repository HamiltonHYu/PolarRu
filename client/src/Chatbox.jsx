import React, { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Message from "./Message";
import * as ENV from "./env";
import EmojiPicker from "./emoji-picker";

import io from "socket.io-client";

const Chatbox = (props) => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [visible, setVisible] = useState(false);

  const ioRef = useRef(null);

  const ref = useRef();

  useEffect(() => {
    let id = setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    }, 100);
    return () => {
      clearTimeout(id);
    };
  }, [allMessages]);

  useEffect(() => {
    const socket = io(ENV.API_URL);
    ioRef.current = socket;

    socket.emit("joinPoll", props.pollId || 1);

    socket.on("message", (data) => {
      setAllMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.close();
    };
  }, []);

  const onClick = () => {
    if (ioRef.current) {
      ioRef.current.emit("message", { pollId: props.pollId || 1, message });
      setMessage("");
    }
  };

  const messages = [];
  for (let i = 0; i < allMessages.length; i++) {
    messages.push(
      <Message
        data={allMessages[i]}
        key={i}
        customRef={i === allMessages.length - 1 ? ref : null}
      />
    );
  }

  return (
    <div>
      <div id="chatBox">
        <div className="messages">
          <div style={{ maxHeight: "15rem", overflowY: "scroll" }}>
            {messages}
          </div>
        </div>
        <div
          style={{
            margin: ".5rem",
            display: "flex",
            alignItems: "center",
            // border: "1px solid black",
          }}
        >
          {/* <TextField */}
          <input
            type="text"
            className="textField"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          {/* ></TextField> */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                fontSize: "1.4rem",
                border: "none",
                padding: "0",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onClick={() => setVisible(!visible)}
            >
              {" "}
              &#129327;
            </button>
            <EmojiPicker visible={visible} setMessage={setMessage} />
          </div>
        </div>

        <div className="sendMessage">
          <Button
            onClick={() => {
              onClick();
            }}
          >
            send message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
