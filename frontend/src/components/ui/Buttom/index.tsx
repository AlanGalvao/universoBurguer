import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './styles.module.scss';
import {FaHamburger} from 'react-icons/fa'

interface ButtomProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    loading?: boolean,
    children: ReactNode,
}

export function Buttom({loading, children, ...rest}: ButtomProps ){
    return(
        <button 
        className={styles.buttom}
        disabled={loading}
        {...rest}
        >
            { loading ? (
                <FaHamburger color='#fff' size={16}/>
            ): (
                <a className={styles.buttomText}>
                {children}
            </a>
            )}
            
        </button>
    )
}