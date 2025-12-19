const Dropdown = ({ options, onSelect, selected, isSimple, isLightTheme, isDisable, required }) => {

  return (
    <div>
      <select className={isSimple? "dropdown" : isLightTheme? "dropdownLight" : "dropdownPlus"} disabled={isDisable} value={selected} onChange={(e)=> onSelect(e.target.value)} required={required}>
        {options &&
          options.map((option, index) => {
            return <option key={index} value={option}>{option}</option>
          })
        }
      </select>
    </div>
  );
};

export default Dropdown;
