import Select from "react-select";

function CustomDropDown(props) {
  return (
    <div
      className={props.className}
      style={{
        // zIndex: 9999,
        // position: "relative",
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
      <div style={{ marginTop: props.label ? 5 : 0 }}>
        <Select
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "rgb(238 241 249/1)",
              border: "1px solid #eaeaea",
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              zIndex: 99999,
            }),
          }}
          onChange={(e) => {
            props.onChange(e.value);
          }}
          options={props.options}
          isSearchable={true}
          placeholder={props.placeholder}
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />
      </div>
    </div>
  );
}

export default CustomDropDown;
