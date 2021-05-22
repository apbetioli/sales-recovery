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
import React from "react"
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

    const handleArchive = async (transaction) => {
        transaction.archived = !transaction.archived
        setSelected(transaction)

        const res = await post(transaction)
        console.log(res)

        setTransactions(await list())
    }

    const handleDelete = async (transaction) => {
        if (window.confirm("Tem certeza que quer deletar?")) {
            setSelected(transaction)

            const res = await post(transaction, 'DELETE')
            console.log(res)

            setTransactions(await list())
        }
    }

    const handleChangePhase = async (event, newValue, transaction, index) => {

        if (transaction.phase != newValue) {
            transaction.phase = newValue
            setSelected(transaction)

            const res = await post(transaction)
            console.log(res)

            setTransactions(await list())
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
                                <TableCell>Checkout</TableCell>
                                <TableCell>Boleto</TableCell>
                                <TableCell>Arquivar</TableCell>
                                <TableCell>Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.transactions.map((transaction, index) => {

                                if (transaction.archived && !showArchived)
                                    return <TableRow key={transaction._id}></TableRow>


                                const intro = `Oi ${transaction.first_name}. Eu sou Alexandre do suporte da Mari Ubialli. Agradecemos o interesse no *${transaction.prod_name}*.`;
                                const dayOfWeek = new Date().getDay();
                                const due = (dayOfWeek >= 5 || dayOfWeek == 0) ? "segunda-feira" : "amanhã"

                                const phase4Text = `${intro} Lembrando que seu boleto vence ${due}. Qualquer dúvida estou à sua disposição.`;

                                const phase1PaymentTypeText = transaction.payment_type == "PIX" ? `/pixajuda` : `/cartaoajuda`;
                                const phase1Text = transaction.payment_type == "billet" ? `Bom dia ${transaction.first_name}. /boletohoje` : `${intro} ${phase1PaymentTypeText}`;

                                const phase2Text = `Bom dia ${transaction.first_name}. ` + (transaction.payment_type == "PIX" ? "/pixexpirou" : "/boletoexpirou");

                                const checkoutId = transaction.prod_name == "Curso Bonecas Joias Raras" ? "B46628840G" : "D49033705A"
                                const checkoutUrl = `https://pay.hotmart.com/${checkoutId}?checkoutMode=10&email=${transaction.email}&name=${transaction.name}&doc=${transaction.doc}&phonenumber=${transaction.phone_checkout_number}&phoneac=${transaction.phone_checkout_local_code}`

                                const phase3Text = `Oi ${transaction.first_name}. Entendo que você deve ter desistido da compra do *${transaction.prod_name}* e não tem problema, mas poderia compartilhar o motivo? A sua resposta é muito importante e irá ajudar a melhorarmos o suporte e a oferta dos nossos cursos. Obrigado desde já.`

                                const whatsLink = `http://wa.me/55${transaction.phone_checkout_local_code}${transaction.phone_checkout_number}`;

                                let rowStyle = classes.normal;
                                switch (transaction.phase || -1) {
                                    case 1: rowStyle = classes.phase1; break;
                                    case 2: rowStyle = classes.phase2; break;
                                    case 3: rowStyle = classes.phase3; break;
                                    case 4: rowStyle = classes.phase4; break;
                                }

                                let currentPhaseText = "";
                                switch (transaction.phase || -1) {
                                    case 1: currentPhaseText = phase1Text; break;
                                    case 2: currentPhaseText = phase2Text; break;
                                    case 3: currentPhaseText = phase3Text; break;
                                    case 4: currentPhaseText = phase4Text; break;
                                }

                                let currentPhaseLabel = "";
                                switch (transaction.phase || -1) {
                                    case 1: currentPhaseLabel = transaction.payment_type == "PIX" ? "Aguardando PIX" : "Boleto vence hoje"; break;
                                    case 2: currentPhaseLabel = "Expirou"; break;
                                    case 3: currentPhaseLabel = "Feedback"; break;
                                    case 4: currentPhaseLabel = "Boletou"; break;
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
                                                    <MenuItem value={1}>{transaction.payment_type == "PIX" ? "Aguardando PIX" : "Boleto vence hoje"}</MenuItem>
                                                    <MenuItem value={2}>Expirou</MenuItem>
                                                    <MenuItem value={3}>Feedback</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <a href={whatsLink + `?text=${currentPhaseText}`} target="_blank">
                                                    WhatsApp
                                                </a>
                                            </TableCell>
                                            <TableCell><a href={checkoutUrl} target="_blank">Checkout</a></TableCell>
                                            <TableCell>{transaction.billet_url && <a href={transaction.billet_url} target="_blank">Boleto</a>}</TableCell>
                                            <TableCell><Checkbox checked={transaction.archived} onChange={(e) => { e.preventDefault(); handleArchive(transaction) }} /></TableCell>
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