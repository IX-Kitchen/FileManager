import React from 'react'
import { Breadcrumb } from 'semantic-ui-react'

const NavBar = ({ nav, handleNavClick }) => {
  let sections = []
  for (let i = 0; i < nav.length - 1; i++) {
    sections.push(<Breadcrumb.Divider key={i} icon='right angle' />)
    sections.push(<Breadcrumb.Section key={nav[i] + i} index={i} link onClick={handleNavClick}>
      {nav[i]}
    </Breadcrumb.Section>)
  }
  let item = nav[nav.length - 1]
  sections.push(<Breadcrumb.Divider key={nav.length} icon='right angle' />)
  sections.push(<Breadcrumb.Section key={item + nav.length} index={nav.length}>
    {item}
  </Breadcrumb.Section>)

  return (
    <Breadcrumb size='huge'>
      {sections}
    </Breadcrumb>
  )
}

export default NavBar
