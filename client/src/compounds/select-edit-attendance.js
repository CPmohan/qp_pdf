import Select from "react-select";

function CustomEditSelectAtt(props) {
  return (
    <div
      style={{
        marginTop: props.margin ? props.margin : 20,
        flex: !props.widthFull ? 3 : null,
        width: props.width,
      }}
    >
      {props.label ? (
        <label
          htmlFor={props.name}
          style={{
            color: "grey",
            fontSize: 13,
          }}
        >
          {props.label}
        </label>
      ) : null}
      <div style={{ marginTop: 5 }}>
        <Select
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              backgroundColor:
                props.value?.value === 1
                  ? "rgba(60, 167, 60, 0.84)"
                  : "rgba(247, 67, 35, 0.87)",
              border: "1px solid #eaeaea",
              color: "white",
            }),
            singleValue: (baseStyles) => ({
              ...baseStyles,
              color: "white",
            }),
            option: (baseStyles, { isSelected }) => ({
              ...baseStyles,
              backgroundColor: "rgba(248, 248, 248, 0.98)",
              color: isSelected ? "black" : "grey",
              border: "1px solid #eaeaea",
              transition: "background-color 0.2s ease-in-out",
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              zIndex: 10,
            }),
          }}
          onChange={(e) => {
            props.onChange(e);
          }}
          value={props.value}
          options={props.options}
          isSearchable={true}
          placeholder={props.placeholder}
        />
      </div>
    </div>
  );
}

export default CustomEditSelectAtt;
