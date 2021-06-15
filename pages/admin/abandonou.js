import {
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    makeStyles,
    TextField
} from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CloseIcon from '@material-ui/icons/Close';
import Head from "next/head";
import React from "react";
import ColorButton from "../../components/ColorButton";

const API_URL = `${process.env.NEXT_PUBLIC_DOMAIN}/api/webhook/abandoned`

const useStyles = makeStyles({
    button: {
        width: "100%",
    },
    table: {
        minWidth: 650,
    },
});

const post = async (transaction, method = 'POST') => {
    return await fetch(API_URL, {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    })
}

export default function Abandonou(props) {
    const classes = useStyles()

    const [abandoned, setAbandoned] = React.useState(props.abandoned);
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState({});
    let [obs, setObs] = React.useState('');

    const handleChange = (prop) => (event) => {
        setObs(event.target.value)
        selected[prop] = event.target.value
    }

    const handleClickOpen = (transaction) => {
        setSelected(transaction)
        setObs(transaction.obs);
        setOpen(true);
    };

    const handleDelete = async (transaction) => {
        if (window.confirm("Tem certeza que quer deletar?")) {
            setSelected(transaction)

            const res = await post(transaction, 'DELETE')
            console.log(res)

            setAbandoned(await list())
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = async (e) => {
        e.preventDefault()

        const res = await post(selected)
        console.log(res)

        setOpen(false)
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
                            id="filled-full-width"
                            label="Obs"
                            type="text"
                            placeholder="..."
                            fullWidth
                            required
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={obs}
                            onChange={handleChange("obs")}
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
                <h1>Abandonou</h1>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell>Produto</TableCell>
                                <TableCell>Obs</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Verificar</TableCell>
                                <TableCell>Whats</TableCell>
                                <TableCell>Checkout</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.abandoned.map((transaction) => {

                                const firstName = transaction.buyerVO.name.split(' ')[0];
                                const text = `Oi ${firstName}. Tudo bem? %0aEu sou Alexandre da equipe da Mari Ubialli. %0aNós ficamos muito felizes que tenha se interessado pelo *${transaction.productName}*. /abandonou`;
                                const checkoutId = transaction.productName == "Curso Bonecas Joias Raras" ? "B46628840G" : "D49033705A";
                                const checkoutUrl = `https://pay.hotmart.com/${checkoutId}?checkoutMode=10&email=${transaction.buyerVO.email}&name=${transaction.buyerVO.name}`;
                                const hoje = new Date().getTime()
                                let begin = new Date()
                                begin.setDate(new Date().getDate()-7)
                                begin = begin.getTime();

                                return (
                                    <TableRow key={transaction._id}>
                                        <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                                        <TableCell>{transaction.productName}</TableCell>
                                        <TableCell><span onClick={() => handleClickOpen(transaction)}>{transaction.obs || '...'}</span></TableCell>
                                        <TableCell>{transaction.buyerVO.name}</TableCell>
                                        <TableCell>{transaction.buyerVO.email}</TableCell>
                                        <TableCell><a href={`https://app-vlc.hotmart.com/sales?endDate=${hoje}&startDate=${begin}&email=${transaction.buyerVO.email}&transactionStatus%5B0%5D=WAITING_PAYMENT&transactionStatus%5B1%5D=APPROVED&transactionStatus%5B2%5D=PRINTED_BILLET&transactionStatus%5B3%5D=CANCELLED&transactionStatus%5B4%5D=CHARGEBACK&transactionStatus%5B5%5D=COMPLETE&transactionStatus%5B6%5D=UNDER_ANALISYS&transactionStatus%5B7%5D=EXPIRED&transactionStatus%5B8%5D=STARTED&transactionStatus%5B9%5D=PROTESTED&transactionStatus%5B10%5D=REFUNDED&transactionStatus%5B11%5D=OVERDUE`} target="_blank">Verificar</a></TableCell>
                                        <TableCell>
                                            {transaction.buyerVO.phone &&
                                                <a href={`http://wa.me/55${transaction.buyerVO.phone}?text=${text}`} target="_blank">Whats</a>
                                            }
                                        </TableCell>
                                        <TableCell><a href={checkoutUrl} target="_blank">Checkout</a></TableCell>
                                        <TableCell><a href="#" onClick={(e) => { e.preventDefault(); handleDelete(transaction); }}>Delete</a></TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
}

async function list() {
    const res = await fetch(API_URL)
    const abandoned = await res.json()
    console.log(abandoned[0]);
    return abandoned;
}

export async function getServerSideProps(context) {

    const abandoned = await list();

    return {
        props: {
            abandoned
        },
    }
}