'use client'

const BackButtonWrapper = ({ classes, children}) => {
    const handleBack = () => window.history.back();
  
    return (
        <button onClick={handleBack} className={classes}>
            {children}
        </button>
    );
}

export default BackButtonWrapper;