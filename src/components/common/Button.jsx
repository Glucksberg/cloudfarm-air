import React from 'react';

function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'cf-button';
  
  const variantClasses = {
    primary: 'cf-bg-primary',
    secondary: 'cf-button-secondary',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50'
  };
  
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-6 py-3',
    large: 'px-8 py-4 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const finalClassName = `
    ${baseClasses} 
    ${variantClasses[variant] || variantClasses.primary} 
    ${sizeClasses[size]} 
    ${disabledClasses} 
    ${className}
  `.trim();
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

