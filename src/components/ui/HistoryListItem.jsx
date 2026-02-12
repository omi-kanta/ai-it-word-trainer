export function HistoryListItem({
  item,
  pos,
  onClick,
  liClassName = "",
  buttonClassName = "",
}) {
  const baseLi = "border border-gray-500 p-2 rounded w-1/5 text-center";
  const posLiStyle =
    "data-[pos=1]:bg-lime-50 data-[pos=2]:bg-blue-50 data-[pos=3]:bg-red-50 data-[pos=4]:bg-purple-50 data-[pos=5]:bg-pink-50";

  const baseBtn = "w-full hover:underline";
  const posBtnStyle =
    "data-[pos=1]:text-lime-600 data-[pos=2]:text-blue-600 data-[pos=3]:text-red-600 data-[pos=4]:text-purple-600 data-[pos=5]:text-pink-600";

  return (
    <li data-pos={pos} className={`${baseLi} ${posLiStyle} ${liClassName}`}>
      <button
        type="button"
        data-pos={pos}
        onClick={() => onClick(item)}
        className={`${baseBtn} ${posBtnStyle} ${buttonClassName}`}
      >
        {item.word}
      </button>
    </li>
  );
}
