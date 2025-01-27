export const Button = ({ children, ...props }) => {
  return (
    <>
        <button className='px-4 py-3 bg-[#0D1E4C] rounded-xl h-11 shadow-md text-sm-semibold w-[240px] flex items-center justify-center active:scale-95 focus:outline-none transition duration-300 transform text-white' {...props}>
            {children}
        </button>
    </>
  )
}
