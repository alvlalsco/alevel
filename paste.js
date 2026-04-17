<span id="event-type-tag"
                                    class="shrink-0 px-2 py-1 md:px-5 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest shadow-sm bg-maroon text-white backdrop-blur-md bg-opacity-90 whitespace-nowrap hidden"></span>
                                <span id="event-department-tag"></span>
${ item.department ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${getDepartmentColor(item.department)} bg-opacity-90 whitespace-nowrap" style="font-size: 10px;">${item.department}</span>` : '' }

<div class="flex flex-row flex-nowrap gap-2 md:gap-3 items-center justify-start flex-1 w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
    ${typeTagHTML}
    ${evt.department ? `<span class="shrink-0 px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${getDepartmentColor(evt.department)} bg-opacity-90 whitespace-nowrap" style="font-size: 10px;">${evt.department}</span>` : ''}
    ${evt.date ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base bg-black/20 font-bold uppercase tracking-widest shadow-sm text-black backdrop-blur-md whitespace-nowrap" style="font-size: 10px;">${evt.date}</span>` : ''}
</div>
const typeTagHTML = evt.event_type ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm bg-maroon text-white backdrop-blur-md bg-opacity-90 whitespace-nowrap" style="font-size: 10px;">${evt.event_type}</span>` : '';

<div class="flex flex-row flex-nowrap gap-2 md:gap-3 items-center justify-start flex-1 w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
    ${evt.department ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${getDepartmentColor(evt.department)} bg-opacity-90 whitespace-nowrap" style="font-size: 10px;">${evt.department}</span>` : ''}
    ${evt.date ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base bg-black/20 font-bold uppercase tracking-widest shadow-sm text-black backdrop-blur-md whitespace-nowrap" style="font-size: 10px;">${evt.date}</span>` : ''}
</div>

                            ${ item.department ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${getDepartmentColor(item.department)} bg-opacity-90 whitespace-nowrap" style="font-size: 12px;">${item.department}</span>` : '' }

<div class="flex flex-row flex-nowrap gap-2 md:gap-3 items-center justify-start flex-1 w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
    ${book.department ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${getDepartmentColor(book.department)} bg-opacity-90 whitespace-nowrap" style="font-size: 12px;">${book.department}</span>` : ''}
    ${book.intake ? `<span class="shrink-0 px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-base bg-black/20 font-bold uppercase tracking-widest shadow-sm text-black backdrop-blur-md whitespace-nowrap" style="font-size: 12px;">${book.intake}</span>` : ''}
</div>