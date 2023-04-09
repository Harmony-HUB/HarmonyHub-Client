import PropTypes from "prop-types";
import styled from "styled-components";

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
`;

const SliderLabel = styled.label`
  margin-bottom: 0.5em;
  font-weight: bold;
`;

function EqualizerSlider({ label, min, max, value, onChange }) {
  return (
    <SliderWrapper>
      <SliderLabel>{label}</SliderLabel>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={{ width: "100%" }}
      />
    </SliderWrapper>
  );
}

EqualizerSlider.propTypes = {
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func,
};

EqualizerSlider.defaultProps = {
  label: null,
  min: null,
  max: null,
  value: null,
  onChange: null,
};

export default EqualizerSlider;
