import "./spinner.css";

interface Props {
  message: string;
}

export const Spinner = ({ message }: Props) => (
  <>
    <span className="spinner" />
    <p>{message}</p>
  </>
);
