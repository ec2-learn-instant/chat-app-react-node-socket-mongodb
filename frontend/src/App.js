import React, { useState, useEffect } from "react";
import "./App.css";

const data = [
  {
    userId: "1",
    userName: "User 1",
    userMessage: [
      {
        messageId: "11",
        messageText: "Hello 11",
        senderId: "5",
        messageTime: new Date(),
      },
      {
        messageId: "12",
        messageText: "Hello 12",
        senderId: "1",
        messageTime: new Date(),
      },
    ],
  },
  {
    userId: "2",
    userName: "User 2",
    userMessage: [
      {
        messageId: "22",
        messageText: "Hello 2",
        senderId: "4",
        messageTime: new Date(),
      },
    ],
  },
  {
    userId: "3",
    userName: "User 3",
    userMessage: [
      {
        messageId: "33",
        messageText: "Hello 3",
        senderId: "3",
        messageTime: new Date(),
      },
    ],
  },
  {
    userId: "4",
    userName: "User 4",
    userMessage: [
      {
        messageId: "44",
        messageText: "Hello 4",
        senderId: "2",
        messageTime: new Date(),
      },
    ],
  },
  {
    userId: "5",
    userName: "User 5",
    userMessage: [
      {
        messageId: "55",
        messageText: "Hello 5",
        senderId: "1",
        messageTime: new Date(),
      },
    ],
  },
];

function App() {
  const [selectedUserId, setSelectedUserId] = useState("1");
  const [allUser, setAllUser] = useState(data);
  const [userMessage, setUserMessage] = useState("");

  return (
    <div className="App">
      <div
        style={{
          padding: "1vh 3vh",
          backgroundColor: "#4cbc4261",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            color: "#3c8b36",
            padding: 10,
            textAlign: "center",
          }}
        >
          React Js + Node Js + MongoDB + Socket.Io
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "94vh",
            border: "2px solid #00000017",
          }}
        >
          <div
            style={{
              width: "30%",
              backgroundColor: "#fff",
              borderRight: "2px solid #00000017",
            }}
          >
            <div
              style={{
                backgroundColor: "#e6e6e6",
                padding: 10,
              }}
            >
              <input
                style={{
                  height: 30,
                  borderRadius: 30,
                  border: "none",
                  outline: "none",
                  padding: "5px 10px",
                  width: "90%",
                }}
                placeholder={"Search...."}
                value={""}
                onChange={(e) => {}}
              />
            </div>
            <div style={{}}>
              {allUser.map((user) => {
                return (
                  <div
                    style={{
                      padding: 20,
                      borderBottom: "2px solid #00000017",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedUserId(user.userId);
                    }}
                  >
                    {user.userName}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              width: "70%",
              backgroundColor: "#e6e6e6",
              borderBottom: "2px solid #00000017",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
              }}
            >
              <span>
                {
                  allUser.filter((user) => {
                    return user.userId === selectedUserId;
                  })[0].userName
                }
              </span>
            </div>
            <div
              style={{
                height: "74vh",
                overflowY: "scroll",
              }}
            >
              {allUser
                .filter((user) => {
                  return user.userId === selectedUserId;
                })[0]
                .userMessage.map((message) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        padding: 10,
                        justifyContent:
                          message.senderId === selectedUserId
                            ? "right"
                            : "left",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#0cbb40",
                          padding: "10px 20px 10px 20px",
                          borderRadius: 30,
                          color: "#fff",
                        }}
                      >
                        {message.messageText}
                      </div>
                    </div>
                  );
                })}
            </div>
            <div
              style={{
                backgroundColor: "#e6e6e6",
                padding: 10,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ width: "90%" }}>
                <input
                  style={{
                    height: 30,
                    borderRadius: 30,
                    border: "none",
                    outline: "none",
                    padding: "5px 20px",
                    width: "93%",
                  }}
                  placeholder={"Type your message here....."}
                  value={userMessage}
                  onChange={(e) => {
                    setUserMessage(e.target.value);
                  }}
                />
              </div>
              <div
                style={{
                  width: "10%",
                  display: "flex",
                  justifyContent: "right",
                }}
              >
                <button
                  style={{
                    cursor: "pointer",
                    backgroundColor: !userMessage ? "#3c3c3c" : "#4CAF50",
                    border: "none",
                    color: "white",
                    padding: "0px 20px",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "16px",
                    borderRadius: 10,
                  }}
                  onClick={() => {
                    if (userMessage !== "") {
                      const allMessage = [...allUser];
                      const userIndex = allUser.findIndex(
                        (el) => el.userId === selectedUserId
                      );

                      allMessage[userIndex].userMessage.push({
                        messageId: new Date().getTime(),
                        messageText: userMessage,
                        senderId: selectedUserId,
                        messageTime: new Date(),
                      });

                      setAllUser(allMessage);
                      setUserMessage("");
                    }
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
