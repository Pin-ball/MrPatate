import { presets } from "@src/config/presets";
import useStore from "@src/store/store";

export default function Customisation() {
  const { setSkins } = useStore();

  // @todo: Highlight preset when selected, remove highlight on changes
  return (
    <ul className="flex flex-wrap items-start gap-2 overflow-auto">
      {presets.map(({ key, logo }) => (
        <li
          key={key}
          onClick={() => setSkins(key)}
          className="p-2 rounded hover:bg-c-neutral-700"
        >
          <img className="size-12" src={logo} alt={"presets"} />
        </li>
      ))}
    </ul>
  );
}
