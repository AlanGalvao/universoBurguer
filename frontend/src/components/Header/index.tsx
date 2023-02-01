import { useContext} from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'
import { FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'

export function Header() {

    const { user, signOut } = useContext(AuthContext)

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <img src='/ublogowhitelittle.png' width={190} height={120} />
                </Link>

                <h1>Olá {user?.name}</h1> {/* usa o ? antes do ponto em caso não haja uma resposta no momento então nada será exibido ao invez de erro */}

                <nav className={styles.menuNav}>
                    <Link href='/category' legacyBehavior>
                        <a>Categoria</a>
                    </Link>
                    <Link href='/product' legacyBehavior>
                        <a>Cardapio</a>
                    </Link>

                    <button onClick={signOut}> {/* chama a função de deslogar */}
                        <FiLogOut color='#FFF' size={24} />
                    </button>
                </nav>
            </div>
        </header>
    )
}