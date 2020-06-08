export function required(message?: string) {
  return (value, errors, name): boolean => {
    let condition: boolean;
    // Required works differently when type is boolean, number, object
    switch (typeof value) {
      case "boolean":
        condition = value === null;
        break;
      case "number":
      case "object":
        condition = value === null || isNaN(value) || Object.keys(value).length === 0;
        break;
      case "string":
      default:
        condition = !value;
    }
    // Validate and message
    if (condition) errors[name] = message ? message : 'Required';
    return condition;
  }
}

export function maxLength(num: number, message?: string) {
  return (value, errors, name): boolean => {
    // If the email not a string, continue validate
    if (typeof value !== 'string') return false;
    // Validate
    const condition: boolean = value.length > num;
    if (condition) errors[name] = message ? message : 'Excess the maximum length';
    return condition;
  }
}
export function minLength(num: number, message?: string) {
  return (value, errors, name): boolean => {
    // If the email not a string, continue validate
    if (typeof value !== 'string') return false;
    // Validate
    const condition: boolean = value.length < num;
    if (condition) errors[name] = message ? message : 'Less than the minimum length';
    return condition;
  }
}

export function email(message?: string) {
  return (value, errors, name): boolean => {
    // If the email not a string, continue validate
    if (typeof value !== 'string') return false;
    // Validate
    const condition: boolean = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
    if (condition) errors[name] = message ? message : 'Invalid email address';
    return condition;
  }
}

export function mustBeTrue(message?: string) {
  return (value, errors, name): boolean => {
    const condition: boolean = !value;
    if (condition) errors[name] = message ? message : 'Invalid input';
    return condition;
  }
}

export function pipeValidator(fields: Field) {
  return values => {
    const errors: any = {};
    // For each field
    for (const key in fields) {
      if (!fields.hasOwnProperty(key)) continue;
      // For each operation
      for (const o of fields[key]) {
        // If an operation is fail
        if (o(values[key], errors, key)) break;
      }
    }
    return errors
  }
}

interface Field {
  [key: string]: ((value, errors, name) => boolean)[]
}
