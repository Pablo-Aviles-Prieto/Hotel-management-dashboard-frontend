import * as React from 'react';

export const RightArrow = (props: any) => (
  <svg
    className='w-6 h-6'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='m9 5 7 7-7 7'
    />
  </svg>
);

export default RightArrow
