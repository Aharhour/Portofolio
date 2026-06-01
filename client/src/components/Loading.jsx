// Spinner-component voor het tonen van een laad-status.
const Loading = () => {
    return (
        <div className='flex flex-col justify-center items-center h-[80vh] gap-4'>
            <div className='relative'>
                <div className='h-16 w-16 rounded-full border-2 border-white/10'></div>
                <div className='absolute inset-0 h-16 w-16 rounded-full border-2 border-transparent border-t-primary animate-spin'></div>
            </div>
            <p className='text-gray-500 text-sm animate-pulse'>Laden...</p>
        </div>
    )
}

export default Loading
