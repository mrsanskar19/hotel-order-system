
const Label = ({children,className,...props}) =>{
  return<label className={`${className} px-2 py-3 rounded `} {...props}>{children}</label>
}

export { Label }
