import "./dependents-popover.css";

interface Props {
  names: string[];
}

export const DependentsPopover = ({ names }: Props) => (
  <div className="dependents-popover">
    <div className="dependents-popover__title">Depended on by</div>
    <ul className="dependents-popover__list">
      {names.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  </div>
);
