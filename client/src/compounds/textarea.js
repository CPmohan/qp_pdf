function CustomTextArea(props) {
  return (
    <div
      className={`${props.width !== undefined ? props.width : "w-full"} mt-${
        props.margin
      }`}
    >
      {props.label !== undefined ? (
        <>
          <label
            style={{
              color: "grey",
              fontSize: 13,
            }}
          >
            {props.label}
          </label>
          <br />
        </>
      ) : null}

      <textarea
        disabled={props.disabled}
        defaultValue={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        type={props.type}
        className={
          `${
            props.disabled ? "bg-white" : "bg-background p-2 py-3"
          } mt-1  w-full outline-none rounded-md ` + props.others
        }
      />
    </div>
  );
}

export default CustomTextArea;
