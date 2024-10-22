import React from "react";
import { Link as RouterLink } from "react-router-dom";

// eslint-disable-next-line react/display-name
const LinkBehavior = React.forwardRef((props, ref) => {
  // Desestructura los props para excluir "button" y cualquier otro prop no deseado
  // eslint-disable-next-line no-unused-vars, react/prop-types
  const { button, ...restProps } = props;

  // Solo pasa los props que deberían ir a RouterLink
  return <RouterLink ref={ref} {...restProps} />;
});

export default LinkBehavior;