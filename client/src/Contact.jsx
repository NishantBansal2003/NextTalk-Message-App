import Avatar from "./Avatar.jsx";

export default function Contact({ id, username, onClick, selected, online,isProfile }) {
  return (
    <div
      key={id}
      onClick={() => onClick(id)}
      className={
        (!isProfile ? "border-b border-gray-100 flex items-center gap-2 cursor-pointer "
        : " flex items-center  " )+
        (selected ? "bg-[#ebeefc]  border border-gray-200" : "")
      }
    >
      {selected && <div className="w-1 bg-[#667eea] h-12 rounded-r-md"></div>}
      <div className="flex gap-2 py-2 pl-4 items-center">
        <Avatar online={online} username={username} userId={id} profile={isProfile}/>
        <span className={!isProfile?"text-gray-800":"text-white text-xl"}>{username}</span>
      </div>
    </div>
  );
}
