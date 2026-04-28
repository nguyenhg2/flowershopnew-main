export default function Stars({ count = 0, size = 14 }) {
  return (
    <span style={{ fontSize: size, letterSpacing: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < count ? '#f5a623' : '#ddd' }}>
          {i < count ? '\u2605' : '\u2606'}
        </span>
      ))}
    </span>
  );
}
