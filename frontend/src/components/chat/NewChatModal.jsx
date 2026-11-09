
import { useEffect, useState } from "react";
import {
  getUsers,
  createPrivateChat,
  createGroupChat
} from "../../services/authService";

function NewChatModal({ onClose, loadChats }) {

  const [users, setUsers] = useState([]);
  const [chatType, setChatType] = useState("private");
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadUsers();
  }, []);

  const handleCreateChat = async (userId) => {
    if (loading) return;

    try {
      setLoading(true);
      setErrorMessage("");

      await createPrivateChat(userId);
      await loadChats();
      onClose();

    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to create chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (loading) return;

    if (!groupName.trim()) {
      setErrorMessage("Please enter a group name.");
      return;
    }

    if (selectedUsers.length < 2) {
      setErrorMessage("Please select at least two users.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await createGroupChat(groupName.trim(), selectedUsers);
      await loadChats();
      onClose();

    } catch (error) {
      console.error(error.response?.data || error);
      setErrorMessage("Unable to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId) => {
    setErrorMessage("");

    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      }

      return [...prev, userId];
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">

      {/* Modal */}
      <div className="bg-white w-full max-w-[400px] max-h-[90dvh] rounded-xl shadow-xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">

          <h2 className="text-lg font-bold text-gray-900">
            New Conversation
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 text-2xl"
          >
            ×
          </button>

        </div>

        {/* Chat Type */}
        <div className="flex gap-2 p-4 shrink-0">

          <button
            onClick={() => {
              setChatType("private");
              setErrorMessage("");
            }}
            className={`flex-1 p-2 rounded-lg font-medium ${
              chatType === "private"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Private
          </button>

          <button
            onClick={() => {
              setChatType("group");
              setErrorMessage("");
            }}
            className={`flex-1 p-2 rounded-lg font-medium ${
              chatType === "group"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Group
          </button>

        </div>

        {/* Group Name */}
        {chatType === "group" && (
          <div className="px-4 pb-3 shrink-0">

            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setErrorMessage("");
              }}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-gray-900 bg-white"
            />

            <p className="text-xs text-gray-500 mt-2">
              Select at least two members
            </p>

          </div>
        )}

        {/* User List */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-3 space-y-2">

          {users.map(user => {
            const isSelected = selectedUsers.includes(user.id);

            return (
              <button
                key={user.id}
                type="button"
                disabled={loading}
                onClick={() =>
                  chatType === "private"
                    ? handleCreateChat(user.id)
                    : toggleUser(user.id)
                }
                className={`w-full flex items-center gap-3 p-3 border rounded-lg text-left transition-colors ${
                  chatType === "group" && isSelected
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100"
                }`}
              >

                {/* User Avatar */}
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-semibold ${
                  chatType === "group" && isSelected
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-600"
                }`}>
                  {user.username?.charAt(0).toUpperCase()}
                </div>

                <span className="flex-1 min-w-0 truncate font-medium">
                  {user.username}
                </span>

                {chatType === "group" && (
                  <span className="text-lg">
                    {isSelected ? "✓" : "○"}
                  </span>
                )}

              </button>
            );
          })}

          {users.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-6">
              No users available
            </p>
          )}

        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mx-4 mb-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 shrink-0">

          {chatType === "group" ? (
            <button
              onClick={handleCreateGroup}
              disabled={loading}
              className="w-full p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          ) : (
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export { NewChatModal };
