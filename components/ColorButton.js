import { Button, makeStyles } from "@material-ui/core";
import React from "react";
import classnames from "classnames";

ColorButton.blue = {
    '--color': 'white',
    '--background-start': '#2196F3',
    '--background-end': '#21CBF3',
    '--box-shadow': 'rgba(33, 203, 243, .3)',
    '--box-shadow-hover': 'rgba(33, 203, 243, .6)',
};

ColorButton.green = {
    '--color': 'black',
    '--background-start': '#6BFEDE',
    '--background-end': '#6BFEDE',
    '--box-shadow': 'rgba(37, 211, 102, .3)',
    '--box-shadow-hover': 'rgba(37, 211, 102, .6)',
};

ColorButton.youtube = {
    '--color': 'white',
    '--background-start': '#E62117',
    '--background-end': '#E62117',
    '--box-shadow': 'rgba(230, 33, 23, .3)',
    '--box-shadow-hover': 'rgba(230, 33, 23, .6)',
};

ColorButton.defaultStyle = {
    '--color': 'white',
    '--background-start': '#FE6BD4',
    '--background-end': '#FE956B',
    '--box-shadow': 'rgba(255, 105, 135, .3)',
    '--box-shadow-hover': 'rgba(255, 105, 135, .6)',
};

ColorButton.whatsapp = {
    '--color': 'white',
    '--background-start': '#25d366',
    '--background-end': '#25d366',
    '--box-shadow': 'rgba(37, 211, 102, .3)',
    '--box-shadow-hover': 'rgba(37, 211, 102, .6)',
};

ColorButton.pink = {
    '--color': 'white',
    '--background-start': '#FE6BD4',
    '--background-end': '#FE6BD4',
    '--box-shadow': 'rgba(255, 105, 135, .3)',
    '--box-shadow-hover': 'rgba(255, 105, 135, .6)',
};

ColorButton.primary = {
    '--color': 'white',
    '--background-start': '#fe6b8b',
    '--background-end': '#fe6b8b',
    '--box-shadow': 'rgba(255, 105, 135, .3)',
    '--box-shadow-hover': 'rgba(255, 105, 135, .6)',
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    button: {
        background: 'linear-gradient(45deg, var(--background-start) 30%, var(--background-end) 90%)',
        borderRadius: 5,
        border: 0,
        boxShadow: '-8px 8px 0 0 var(--box-shadow)',
        color: 'var(--color)',
        fontWeight: 'bold',
        height: 72,
        padding: '0 30px',
        textAlign: 'center',
        '&:hover': {
            boxShadow: '-8px 8px 0 0 var(--box-shadow-hover)',
        },
        [theme.breakpoints.down("xs")]: {
            boxShadow: "none",
            width: "100%"
        },
    },
}));

export default function ColorButton(props) {
    const classes = useStyles();

    return (<Button
        variant="contained"
        style={ColorButton.defaultStyle}
        {...props}
        className={classnames(props.className, classes.button)}
    >
        {props.children}
    </Button>);
}

ColorButton.defaultProps = {
    size: "large"
};
