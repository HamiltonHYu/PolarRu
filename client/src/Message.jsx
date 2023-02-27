import React from "react";

const Message = (props) => {
  return (
    <div ref={props.customRef || null} style={{ margin: "4px" }}>
      {props.data}
    </div>
  );
};

export default Message;
