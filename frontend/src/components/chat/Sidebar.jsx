function Sidebar() {
  return (
    <div className="w-[350px] border-r border-gray-300 bg-white">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-2xl font-bold">
          Messages
        </h2>
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 rounded-lg border outline-none"
        />
      </div>

      {/* Conversations */}
      <div className="overflow-y-auto h-[calc(100vh-140px)]">

        <div className="p-4 hover:bg-gray-100 cursor-pointer border-b">
          <h3 className="font-semibold">Mr A</h3>
          <p className="text-sm text-gray-500 truncate">
            Last message here...
          </p>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;