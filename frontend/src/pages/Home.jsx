import { useEffect, useState } from "react";
import { getUsers, getMessages, sendMessage } from "../services/message_service";
import { socket } from "../services/socket";

export const Home = ({ token, userId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getUsers(token);
      setUsers(allUsers);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      const msgs = await getMessages(selectedUser._id, token);
      setMessages(msgs);
    };
    fetchMessages();
  }, [selectedUser , token]);

 

  useEffect(() => {
    socket.on("newMessage", (msg) => {
      if (msg.senderId === selectedUser?._id || msg.receiverId === selectedUser?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedUser]);


const handleSend = async (e) => {
  e.preventDefault();
  if (!text || !selectedUser) return;

  const newMsg = await sendMessage(text, selectedUser._id, token);

  setMessages((prev) => [...prev, newMsg]);
  setText("");

  socket.emit("sendMessage", { receiverId: selectedUser._id, text: newMsg.text });
};


  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      <div className="w-80 bg-gray-900 border-r border-gray-800 p-6">
        <h2 className="text-xl font-semibold tracking-tight text-gray-100 mb-6">Users</h2>
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u._id}
              className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedUser?._id === u._id 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-gray-100"
              }`}
              onClick={() => setSelectedUser(u)}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                  selectedUser?._id === u._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}>
                  {u.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <span className="text-sm font-medium">{u.fullName}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col bg-gray-950">
        {selectedUser ? (
          <>
            <div className="p-6 border-b border-gray-800 bg-gray-900/50">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white mr-4">
                  {selectedUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <h3 className="text-lg font-semibold text-gray-100">{selectedUser.fullName}</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.senderId === userId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl transition-all duration-200 ${
                    m.senderId === userId
                      ? "bg-blue-600 text-white rounded-br-md shadow-lg"
                      : "bg-gray-800 text-gray-100 rounded-bl-md border border-gray-700"
                  }`}>
                    <span className="text-sm leading-relaxed">{m.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-800 bg-gray-900/50">
              <div className="flex space-x-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-2xl text-gray-100 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
                />
                <button 
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg hover:shadow-blue-600/25 disabled:shadow-none"
                  onClick={handleSend}
                  disabled={!text.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Select a conversation</h3>
                <p className="text-sm text-gray-500">Choose a contact to start messaging</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};