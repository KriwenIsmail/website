import { useState, useEffect, useRef } from "react"

const Select = ({ selected, setSelected, options, position = 'bottom', customClasses = '' }) => {
  const optionsRef = useRef(null)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const changeSelection = selection => {
    setSelected(selection)
    setOptionsOpen(false)
  }

  useEffect(() => {
    if (optionsRef.current != null) optionsRef.current?.classList.add('hidden')
  }, [optionsRef.current])

  useEffect(() => {
    if (optionsRef.current != null) {
      if (optionsOpen) {
        optionsRef.current?.classList.remove('hidden')
        setTimeout(() => optionsRef.current?.classList.remove('opacity-0'), 0)
      } else {
        optionsRef.current?.classList.add('opacity-0')
        setTimeout(() => optionsRef.current?.classList.add('hidden'), 150)
      }
    }
  }, [optionsOpen])

  useEffect(() => {
    typeof document === 'object' && document.addEventListener('click', e => {
      if (!e.target.hasAttribute('data-customselectbox')) setOptionsOpen(false)
    })
  }, [])

  return (<>
    <div data-customselectbox className={`mb-4 relative ${customClasses}`}>
      <div data-customselectbox onClick={() => setOptionsOpen(prev => !prev)} className={`shadow-lg bg-neutral-800 dark:bg-gray-50 text-white dark:text-black rounded-sm cursor-pointer w-fit px-2 py-1 flex items-center justify-between`}>
        <span data-customselectbox className="pr-2 font-medium capitalize">{selected}</span>
        <i data-customselectbox className="fas fa-caret-down"></i>
      </div>
      <div data-customselectbox ref={optionsRef} className={`opacity-0 absolute p-2 select-floating-options-on-${position} left-0 right-0 shadow-md shadow-gray-700 dark:shadow-gray-300 bg-neutral-800 dark:bg-gray-50 text-white dark:text-black rounded-sm w-fit transition-opacity duration-150`}>
        {options.map((_, i) => <div key={i} onClick={() => changeSelection(_)} className={`capitalize px-2 py-1 mb-2 transition duration-100 hover:bg-white dark:hover:bg-black cursor-pointer rounded-sm hover:text-neutral-800 dark:hover:text-gray-50 ${selected == _ && 'text-neutral-800 dark:text-gray-50 bg-white dark:bg-black'}`}>
          {_}
        </div>)}
      </div>
    </div>
  </>)
}

export default Select