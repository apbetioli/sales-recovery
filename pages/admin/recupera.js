import {
    Checkbox,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    makeStyles,
    MenuItem,
    Select,

    TextField
} from "@material-ui/core"
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import CloseIcon from '@material-ui/icons/Close'
import Head from "next/head"
import React, { useEffect } from "react"
import ColorButton from "../../components/ColorButton"

const API_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/api/webhook/transaction`

const useStyles = makeStyles({
    button: {
        width: "100%",
    },
    table: {
        minWidth: 650,
    },
    phase1: {
        backgroundColor: "#FFB6AD"
    },
    phase2: {
        backgroundColor: "#FDECB6"
    },
    phase3: {
        backgroundColor: "lightblue"
    },
    phase4: {
        backgroundColor: "lightgreen"
    },
    normal: {

    },
    inputNumber: {
        width: 100
    }
})

const post = async (transaction, method = 'POST') => {
    try {
        return await fetch(API_URL, {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        })
    } catch (e) {
        alert(e)
        throw e;
    }
}

export default function Recupera(props) {
    const classes = useStyles()

    const [showArchived, setShowArchived] = React.useState(false)
    const [transactions, setTransactions] = React.useState(props.transactions)
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState({})
    const [obs, setObs] = React.useState('')

    const handleChangeShowArchived = () => {
        setShowArchived(!showArchived)
    }

    const handleChangeObs = (event) => {
        setObs(event.target.value)
    }

    const handleClickOpen = (transaction) => {
        setSelected(transaction)
        setObs(transaction.obs)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        selected['obs'] = obs
        setOpen(false)

        const res = post(selected)
        console.log(res)
    }

    const removeFromList = (transaction) => {
        setTransactions(transactions.filter(item => item !== transaction))
    }

    const handleArchive = async (transaction) => {
        transaction.archived = !transaction.archived

        const res = await post(transaction)
        console.log(res)

        removeFromList(transaction)
    }

    
    const handleApprove = async (transaction) => {
        transaction.status = "approved"
        transaction.cms_vendor = transaction.price

        const res = await post(transaction)
        console.log(res)
        
        removeFromList(transaction)
    }    

    const handleDelete = async (transaction) => {
        if (window.confirm("Tem certeza que quer deletar?")) {

            const res = await post(transaction, 'DELETE')
            console.log(res)

            removeFromList(transaction)
        }
    }

    const handleChangePhase = async (event, newValue, transaction, index) => {

        if (transaction.phase != newValue) {
            transaction.phase = newValue

            const res = await post(transaction)
            console.log(res)

            setTransactions(transactions.map(item => item._id === transaction._id ? transaction : item));
        }
    }

    return (
        <>
            <Head>
                <meta name="robots" content="noindex,nofollow"></meta>
            </Head>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Editar
                    <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={onSubmit.bind(this)}>
                        <TextField
                            label="Obs"
                            type="text"
                            placeholder="..."
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={obs}
                            onChange={handleChangeObs}
                        />
                        <ColorButton
                            variant="contained"
                            type="submit"
                            className={classes.button}
                        >
                            Salvar
                        </ColorButton>
                    </form>

                </DialogContent>
                <DialogActions>
                </DialogActions>

            </Dialog>
            <Container maxWidth="xl">
                <h1>Recuperar</h1>
                <div>
                    <FormControlLabel
                        control={<Checkbox checked={showArchived} onChange={handleChangeShowArchived} name="checkedA" />}
                        label="Mostrar arquivados"
                    />
                </div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell>Produto</TableCell>
                                <TableCell>Pagamento</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Obs</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Celular checkout</TableCell>
                                <TableCell>Fase</TableCell>
                                <TableCell>Mensagem</TableCell>
                                <TableCell>Hotmart</TableCell>
                                <TableCell>Checkout</TableCell>
                                <TableCell>Boleto</TableCell>
                                <TableCell>Arquivar</TableCell>
                                <TableCell>Aprovar</TableCell>
                                <TableCell>Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction, index) => {

                                if (transaction.archived && !showArchived)
                                    return <TableRow key={transaction._id}></TableRow>

                                const oi = `Oi ${transaction.first_name}. Tudo bem? Aqui é o Alexandre. `;
                                const intro = `${oi}Sou da equipe da Mari Ubialli. %0aRecebemos sua inscrição no *${transaction.prod_name}*. `;

                                const hoje = new Date(new Date().toDateString())
                                const end = hoje.getTime()

                                let start = hoje
                                start.setDate(hoje.getDate() - 7)
                                start = start.getTime();

                                const phase1PaymentTypeText = transaction.payment_type == "PIX" ? `/pixajuda` : ( transaction.payment_type == "billet" ? `/boletohoje` : `/cartaoajuda`);
                                const phase2PaymentTypeText = transaction.payment_type == "PIX" ? "/pixexpirou" : (transaction.payment_type == "billet" ? "/boletoexpirou": "/cartaoajuda");

                                const checkoutId = transaction.prod_name == "Curso Bonecas Joias Raras" ? "B46628840G" : "D49033705A"
                                const checkoutUrl = `https://pay.hotmart.com/${checkoutId}?checkoutMode=10&email=${transaction.email}&name=${transaction.name}&doc=${transaction.doc}&phonenumber=${transaction.phone_checkout_number}&phoneac=${transaction.phone_checkout_local_code}`

                                const whatsLink = `http://wa.me/55${transaction.phone_checkout_local_code}${transaction.phone_checkout_number}`;

                                let rowStyle = classes.normal;
                                let currentPhaseText = "";
                                let currentPhaseLabel = "";

                                switch (transaction.phase) {
                                    case 1: {
                                        rowStyle = classes.phase1;
                                        currentPhaseText = `${intro}%0a${phase1PaymentTypeText}`; 
                                        currentPhaseLabel = transaction.payment_type == "PIX" ? "Aguardando PIX" : (transaction.payment_type == "billet" ? "Boleto vence hoje" : "Cartão cancelado");
                                        break;
                                    };
                                    case 2: {
                                        rowStyle = classes.phase2;
                                        currentPhaseText = `${oi}%0a${phase2PaymentTypeText}`;
                                        currentPhaseLabel = "Expirou"; 
                                        break;
                                    }                                    
                                    case 3: {
                                        rowStyle = classes.phase3;
                                        currentPhaseText = `${intro}%0a/abandonou`; 
                                        currentPhaseLabel = "Abandonou";
                                        break;
                                    }
                                    case 4: {
                                        rowStyle = classes.phase4;
                                        currentPhaseText = `${intro}%0aAssim que o pagamento for confirmado, o acesso ao curso será liberado. %0aVocê receberá todos os dados de acesso no seu e-mail.`; 
                                        currentPhaseText += `%0a%0aPara imprimir seu boleto é só acessar o link:%0a${transaction.billet_url}`; 
                                        currentPhaseText += `%0a%0aSe preferir, você também pode usar a linha digitável para pagar online:%0a${transaction.billet_barcode}`;
                                        currentPhaseText += `%0a%0aPS: Atente-se à data de vencimento do boleto.`; 
                                        currentPhaseText += `%0aQualquer dúvida pode contar comigo :)`; 
                                        currentPhaseLabel = "Boletou";
                                        break;
                                    }
                                }

                                if (["expired", "waiting_payment", "canceled", "billet_printed"].includes(transaction.status)) {
                                    return (
                                        <TableRow key={transaction._id} className={rowStyle}>
                                            <TableCell>{new Date(transaction.purchase_date).toLocaleString()}</TableCell>
                                            <TableCell>{transaction.prod_name}</TableCell>
                                            <TableCell>{transaction.payment_type}</TableCell>
                                            <TableCell>{transaction.status}</TableCell>
                                            <TableCell><span onClick={() => handleClickOpen(transaction)}>{transaction.obs || '...'}</span></TableCell>
                                            <TableCell>{transaction.name}</TableCell>
                                            <TableCell>{transaction.email}</TableCell>
                                            <TableCell>
                                                <a href={`http://wa.me/55${transaction.phone_local_code}${transaction.phone_number}`} target="_blank">{transaction.phone_local_code + '' + transaction.phone_number}</a><br />
                                                <a href={whatsLink} target="_blank">{transaction.phone_checkout_local_code + '' + transaction.phone_checkout_number}</a>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={transaction.phase || 0}
                                                    onChange={(e) => handleChangePhase(e, e.target.value, transaction, index)}
                                                >
                                                    <MenuItem value={0}>Novo</MenuItem>
                                                    <MenuItem value={4}>Boletou</MenuItem>
                                                    <MenuItem value={1}>{transaction.payment_type == "PIX" ? "Aguardando PIX" : (transaction.payment_type == "billet" ? "Boleto vence hoje" : "Cartão cancelado")}</MenuItem>
                                                    <MenuItem value={2}>Expirou</MenuItem>
                                                    <MenuItem value={3}>Abandonou</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <a href={whatsLink + `?text=${currentPhaseText}`} target="_blank">
                                                    WhatsApp
                                                </a>
                                            </TableCell>
                                            <TableCell><a href={`https://app-vlc.hotmart.com/sales?endDate=${end}&startDate=${start}&email=${transaction.email}&transactionStatus%5B0%5D=WAITING_PAYMENT&transactionStatus%5B1%5D=APPROVED&transactionStatus%5B2%5D=PRINTED_BILLET&transactionStatus%5B3%5D=CANCELLED&transactionStatus%5B4%5D=CHARGEBACK&transactionStatus%5B5%5D=COMPLETE&transactionStatus%5B6%5D=UNDER_ANALISYS&transactionStatus%5B7%5D=EXPIRED&transactionStatus%5B8%5D=STARTED&transactionStatus%5B9%5D=PROTESTED&transactionStatus%5B10%5D=REFUNDED&transactionStatus%5B11%5D=OVERDUE`} target="_blank">Hotmart</a></TableCell>
                                            <TableCell><a href={checkoutUrl} target="_blank">Checkout</a></TableCell>
                                            <TableCell>{transaction.billet_url && <a href={transaction.billet_url} target="_blank">Boleto</a>}</TableCell>
                                            <TableCell><Checkbox checked={transaction.archived || false} onChange={(e) => { e.preventDefault(); handleArchive(transaction) }} /></TableCell>
                                            <TableCell><a href="#" onClick={(e) => { e.preventDefault(); handleApprove(transaction) }}>Aprovar</a></TableCell>
                                            <TableCell><a href="#" onClick={(e) => { e.preventDefault(); handleDelete(transaction) }}>Excluir</a></TableCell>
                                        </TableRow>
                                    )
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    )
}

async function list() {
    const res = await fetch(API_URL)
    return await res.json()
}

export async function getServerSideProps(context) {

    const transactions = await list()
    console.log(transactions[0])

    return {
        props: {
            transactions
        },
    }
}