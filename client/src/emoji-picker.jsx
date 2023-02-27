import React, { useState } from "react";
import Picker from "emoji-picker-react";

const EmojiPicker = (props) => {
  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject);
    props.setMessage((message) => message + emojiObject.emoji);
  };

  return (
    <div
      style={{
        display: props.visible ? "" : "none",
        position: "absolute",
        top: "0",
        left: "105%",
      }}
    >
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
};

export default EmojiPicker;
