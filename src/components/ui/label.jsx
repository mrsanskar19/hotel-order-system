
const Label = ({children,className,...props}) =>{
  return<label className={`${className} bg-gray-500 px-2 py-3 rounded `} {...props}>{children}</label>
}

export { Label }
