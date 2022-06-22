import React, { useState, useEffect } from "react";
import { AiOutlineMore, AiOutlinePaperClip } from "react-icons/ai";
import {
  BsFillChatLeftTextFill,
  BsCircle,
  BsSearch,
  BsEmojiSmile,
} from "react-icons/bs";
import { MdSend, MdOutlineLogout } from "react-icons/md";
import DefaultChatImage from "./assets/default-chat.png";
import io from "socket.io-client";
import "./App.css";



function App() {
  const [allUser, setAllUser] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [userLogin, setUserLogin] = useState(false);

  const [loginUserName, setLoginUserName] = useState("");
  const [loginMobileNo, setLoginMobileNo] = useState("");

  const [chatUserId, setChatUserId] = useState("");
  const [chatUserName, setChatUserName] = useState("");

  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // establish socket connection
  useEffect(() => {
    setSocket(io("http://localhost:8000", { transports: ["websocket"] }));
  }, []);

  // subscribe to the socket event
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setSocketConnected(socket.connected);
    });

    socket.on("join", (data) => {
      console.log("Newly joined!!", data);
      setAllUser(data);
    });

    socket.on("message", (data) => {
      console.log("Message Received", data);
      setAllUser(data);
    });

    socket.on("disconnect", () => {
      setSocketConnected(socket.connected);
    });
  }, [socket]);

  // manage socket connection
  const handleSocketConnection = () => {
    console.log('Disconnecting socket...');
    if(socket) socket.disconnect();
  };

  const addNewJoiner = ({ loginUserName, loginMobileNo }) => {
    socket.connect();
    socket.emit("create", { userId: loginMobileNo, userName: loginUserName });
    setUserLogin(true);
    setLoginUserName(loginUserName);
    setLoginMobileNo(loginMobileNo);
  };

  const sendMessageToServer = ({ loginMobileNo, chatUserId, messageText }) => {
    socket.emit("message", { loginMobileNo, chatUserId, messageText });
    setMessageText("");
  };

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  return (
    <div className="App">
      {userLogin ? (
        <div
          style={{
            backgroundColor: "#f0f2f5",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "30%",
                backgroundColor: "#fff",
                borderRight: "2px solid #00000017",
              }}
            >
              <div>
                <div
                  style={{
                    backgroundColor: "#f0f2f5",
                    padding: 10,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        height: 40,
                        width: 40,
                        background: "#fff",
                        borderRadius: 50,
                      }}
                    >
                      <div
                        style={{
                          justifyContent: "center",
                          margin: "auto",
                          display: "flex",
                          padding: 4,
                          fontSize: 25,
                        }}
                      >
                        S
                      </div>
                    </div>
                    <div style={{ padding: 7 }}>
                      <div style={{ fontSize: 15, color: "#000" }}>
                        {loginUserName}
                      </div>
                      <div style={{ fontSize: 10, color: "#808080" }}>
                        {loginMobileNo}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", padding: 5 }}>
                    <div
                      title="Status"
                      style={{
                        paddingRight: 15,
                        fontSize: 19,
                        cursor: "pointer",
                      }}
                    >
                      <BsCircle />
                    </div>
                    <div
                      title="New Chat"
                      style={{
                        paddingRight: 15,
                        fontSize: 19,
                        cursor: "pointer",
                      }}
                    >
                      <BsFillChatLeftTextFill />
                    </div>
                    <div
                      title="Menu"
                      style={{
                        paddingRight: 15,
                        fontSize: 19,
                        cursor: "pointer",
                      }}
                    >
                      <AiOutlineMore />
                    </div>

                    <div
                      title="Logout"
                      style={{
                        paddingRight: 15,
                        fontSize: 19,
                        cursor: "pointer",
                      }}
                      onClick={()=>{
                        handleSocketConnection();
                        setUserLogin(false);
                        
                      }}
                    >
                      <MdOutlineLogout />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: "#fff", padding: 10 }}>
                <input
                  style={{
                    height: 25,
                    borderRadius: 6,
                    background: "#f0f2f5",
                    border: "none",
                    outline: "none",
                    padding: "5px 10px",
                    width: "95%",
                  }}
                  placeholder={"Search or start new chat"}
                  value={""}
                  onChange={(e) => {}}
                />
              </div>
              <div style={{ height: 1, background: "##f0f2f5" }}></div>
              <div
                style={{
                  height: "83vh",
                  overflow: "scroll",
                  overflowX: "hidden",
                }}
              >
                {
                  // allUser.length ? (
                  allUser.map((user, index) => {
                    return user.userId !== loginMobileNo ? (
                      <div
                        key={user.userId}
                        style={{
                          padding: 12,
                          borderBottom: "1px solid #00000017",
                          cursor: "pointer",
                          background:
                            user.userId === chatUserId ? "#f0f2f5" : "#fff",
                        }}
                        onClick={() => {
                          setChatUserName(user.userName);
                          setChatUserId(user.userId);
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: 2,
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <div
                              style={{
                                height: 40,
                                width: 40,
                                background: "#e7e7e7",
                                borderRadius: 50,
                              }}
                            >
                              <div
                                style={{
                                  justifyContent: "center",
                                  margin: "auto",
                                  display: "flex",
                                  padding: 8,
                                  fontSize: 20,
                                  color: "#7a7070",
                                }}
                              >
                                {user.userName[0]}
                              </div>
                            </div>
                            <div style={{ marginLeft: 20 }}>
                              <div style={{ padding: 2 }}>{user.userName}</div>
                              <div
                                style={{
                                  color: "#808080",
                                  fontSize: 13,
                                  padding: 2,
                                }}
                              >
                                {user.userMessage.length
                                  ? user.userMessage[
                                      user.userMessage.length - 1
                                    ].receiverId === loginMobileNo ||
                                    user.userMessage[
                                      user.userMessage.length - 1
                                    ].senderId === loginMobileNo
                                    ? user.userMessage[
                                        user.userMessage.length - 1
                                      ].messageText
                                    : ""
                                  : ""}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              color: "#808080",
                              fontSize: 13,
                              marginTop: 10,
                            }}
                          >
                            {user.userMessage.length
                              ? formatAMPM(
                                  new Date(
                                    user.userMessage[
                                      user.userMessage.length - 1
                                    ].messageTime
                                  )
                                )
                              : ""}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })
                // ) : (
                //   <div
                //     style={{
                //       fontSize: 12,
                //       color: "#808080",
                //       textAlign: "center",
                //     }}
                //   >
                //     No user found.
                //   </div>
                // )
              }
              </div>
            </div>

            {chatUserId ? (
              <div
                style={{
                  width: "70%",
                  backgroundColor: "#e6e6e6",
                  borderBottom: "2px solid #00000017",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f0f2f5",
                    padding: 10,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          height: 40,
                          width: 40,
                          background: "#e7e7e7",
                          borderRadius: 50,
                        }}
                      >
                        <div
                          style={{
                            justifyContent: "center",
                            margin: "auto",
                            display: "flex",
                            padding: 8,
                            fontSize: 20,
                            color: "#7a7070",
                          }}
                        >
                          {chatUserName[0]}
                        </div>
                      </div>
                      <div style={{ padding: "10px 20px" }}>{chatUserName}</div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div
                        title="Search"
                        style={{
                          marginRight: 20,
                          marginTop: 10,
                          fontSize: 20,
                          cursor: "pointer",
                        }}
                      >
                        <BsSearch />
                      </div>
                      <div
                        title="Menu"
                        style={{
                          marginRight: 20,
                          marginTop: 5,
                          fontSize: 25,
                          cursor: "pointer",
                        }}
                      >
                        <AiOutlineMore />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    height: "81vh",
                    overflow: "scroll",
                    background: "#efeae2",
                    overflowX: "hidden",
                  }}
                >
                  {allUser.filter((user) => {
                    return user.userId === chatUserId;
                  }).length
                    ? allUser
                        .filter((user) => {
                          return user.userId === chatUserId;
                        })[0]
                        .userMessage.map((message) => {
                          return message.receiverId === loginMobileNo ||
                            message.senderId === loginMobileNo ? (
                            <div
                              key={message.messageId}
                              style={{
                                display: "flex",
                                padding: 10,
                                justifyContent:
                                  message.receiverId === loginMobileNo
                                    ? "left"
                                    : "right",
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: "#d8f5d3",
                                  padding: "10px 20px 10px 20px",
                                  borderRadius: 30,
                                  maxWidth:"40vw",
                                  color: "#000",
                                }}
                              >
                                {message.messageText}
                                <span
                                  style={{
                                    fontSize: 10,
                                    marginLeft: 10,
                                    color: "#808080",
                                  }}
                                >
                                  {message.messageTime
                                    ? formatAMPM(new Date(message.messageTime))
                                    : ""}
                                </span>
                              </div>
                            </div>
                          ) : null;
                        })
                    : null}
                </div>

                <div style={{ background: "#f0f2f5", height: "12vh" }}>
                  <div
                    style={{
                      backgroundColor: "#e6e6e6",
                      padding: 15,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        width: "5%",
                        display: "flex",
                        justifyContent: "space-around",
                        marginTop: 10,
                        fontSize: 23,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (messageText !== "") {
                          sendMessageToServer({
                            loginMobileNo,
                            chatUserId,
                            messageText,
                          });
                        }
                      }}
                    >
                      <BsEmojiSmile />
                    </div>

                    <div
                      style={{
                        width: "5%",
                        display: "flex",
                        justifyContent: "space-around",
                        marginTop: 10,
                        fontSize: 23,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (messageText !== "") {
                          sendMessageToServer({
                            loginMobileNo,
                            chatUserId,
                            messageText,
                          });
                        }
                      }}
                    >
                      <AiOutlinePaperClip />
                    </div>

                    <div style={{ width: "83%" }}>
                      <input
                        style={{
                          height: 30,
                          borderRadius: 6,
                          border: "none",
                          outline: "none",
                          padding: "5px 20px",
                          width: "95%",
                        }}
                        placeholder={"Type your message here....."}
                        value={messageText}
                        onChange={(e) => {
                          setMessageText(e.target.value);
                        }}
                      />
                    </div>
                    <div
                      style={{
                        width: "7%",
                        display: "flex",
                        justifyContent: "space-around",
                        marginTop: 10,
                        fontSize: 23,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (messageText !== "") {
                          sendMessageToServer({
                            loginMobileNo,
                            chatUserId,
                            messageText,
                          });
                        }
                      }}
                    >
                      <MdSend />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: "70%",
                  backgroundColor: "#e6e6e6",
                  borderBottom: "2px solid #00000017",
                }}
              >
                <img
                  style={{ height: "100%", width: "100%" }}
                  src={DefaultChatImage}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#00a884",
            padding: 10,
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "center", color: "#fff" }}
          >
            <h2>Whatsapp Web</h2>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ padding: 10 }}>
              <input
                style={{
                  height: 30,
                  borderRadius: 6,
                  border: "none",
                  outline: "none",
                  padding: "5px 10px",
                  width: "20%",
                }}
                type="number"
                placeholder={"Mobile No"}
                value={loginMobileNo}
                onChange={(e) => {
                  setLoginMobileNo(e.target.value);
                }}
              />
            </div>

            <div style={{ padding: 10 }}>
              <input
                style={{
                  height: 30,
                  borderRadius: 6,
                  border: "none",
                  outline: "none",
                  padding: "5px 10px",
                  width: "20%",
                }}
                placeholder={"Your Name"}
                value={loginUserName}
                onChange={(e) => {
                  setLoginUserName(e.target.value);
                }}
              />
            </div>

            <div style={{ padding: 10 }}>
              <button
                style={{
                  cursor: "pointer",
                  backgroundColor: "#307b64",
                  border: "none",
                  color: "#fff",
                  padding: "10px 20px",
                  textAlign: "center",
                  textDecoration: "none",
                  display: "inline-block",
                  fontSize: "16px",
                  borderRadius: 10,
                }}
                onClick={() => {
                  if (loginMobileNo && loginUserName) {
                    addNewJoiner({ loginUserName, loginMobileNo });
                  }
                }}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;



// const data = [
//   {
//     userId: "1",
//     userName: "User 1",
//     userMessage: [
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "2",
//     userName: "User 2",
//     userMessage: [
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "4",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "3",
//     userName: "User 3",
//     userMessage: [
//       {
//         messageId: "33",
//         messageText: "Hello 3",
//         senderId: "3",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "4",
//     userName: "User 4",
//     userMessage: [
//       {
//         messageId: "44",
//         messageText: "Hello 4",
//         senderId: "2",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "5",
//     userName: "User 5",
//     userMessage: [
//       {
//         messageId: "55",
//         messageText: "Hello 5",
//         senderId: "1",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "6",
//     userName: "User 1",
//     userMessage: [
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "7",
//     userName: "User 2",
//     userMessage: [
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "4",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "8",
//     userName: "User 3",
//     userMessage: [
//       {
//         messageId: "33",
//         messageText: "Hello 3",
//         senderId: "3",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "9",
//     userName: "User 4",
//     userMessage: [
//       {
//         messageId: "44",
//         messageText: "Hello 4",
//         senderId: "2",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "10",
//     userName: "User 5",
//     userMessage: [
//       {
//         messageId: "55",
//         messageText: "Hello 5",
//         senderId: "1",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "11",
//     userName: "User 1",
//     userMessage: [
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "1",
//         receiverId: "4",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "12",
//     userName: "User 2",
//     userMessage: [
//       {
//         messageId: "22",
//         messageText: "Hello 2",
//         senderId: "4",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "13",
//     userName: "User 3",
//     userMessage: [
//       {
//         messageId: "33",
//         messageText: "Hello 3",
//         senderId: "3",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "14",
//     userName: "User 4",
//     userMessage: [
//       {
//         messageId: "44",
//         messageText: "Hello 4",
//         senderId: "2",
//         messageTime: new Date(),
//       },
//     ],
//   },
//   {
//     userId: "15",
//     userName: "User 5",
//     userMessage: [
//       {
//         messageId: "55",
//         messageText: "Hello 5",
//         senderId: "1",
//         messageTime: new Date(),
//       },
//     ],
//   },
// ];