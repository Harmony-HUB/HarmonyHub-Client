function VerticalSlider({ label, min, max, step, value, onChange }) {
  const inputId = `${label}-slider`;
  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        style={{
          width: "20px",
          height: "100px",
          writingMode: "bt-1r",
          WebkitAppearance: "slider-vertical",
        }}
      />
    </div>
  );
}

export default VerticalSlider;
