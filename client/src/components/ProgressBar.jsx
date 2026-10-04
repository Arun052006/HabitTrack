export default function ProgressBar({ percent }) {
  return <div className="bar"><div className="bar-fill" style={{ width: percent + '%' }} /></div>;
}
