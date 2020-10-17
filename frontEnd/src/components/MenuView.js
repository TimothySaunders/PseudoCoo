import { render } from '@testing-library/react'
import React, { Fragment } from 'react'

const MenuView = (props) => {
    render()

    return (
        <Fragment>
            <p> I am menu view</p>
            <br />
            <button onClick={props.chooseMenu(this.value)} value="1"> Play </button><br />
            <button onClick={props.chooseMenu(this.value)} value="2"> Extract from Image </button><br />
            <button onClick={props.chooseMenu(this.value)} value="3"> Continue game </button>
        </Fragment>
    )
}

export default MenuView;
