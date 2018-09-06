import React from 'react'
import Adapter from 'enzyme-adapter-react-15'
import { configure, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router'
import { Home } from '../../../src/components/Home/index'
import {
  contractStore,
  crowdsaleStore,
  deploymentStore,
  gasPriceStore,
  generalStore,
  reservedTokenStore,
  stepTwoValidationStore,
  tierStore,
  tokenStore,
  web3Store
} from '../../../src/stores'
import storage from 'store2'

configure({ adapter: new Adapter() })

describe('Home', () => {
  const stores = {
    contractStore,
    crowdsaleStore,
    deploymentStore,
    gasPriceStore,
    generalStore,
    reservedTokenStore,
    stepTwoValidationStore,
    tierStore,
    tokenStore,
    web3Store
  }

  it(`should render Home screen`, () => {
    // Given
    const component = renderer.create(
      <MemoryRouter initialEntries={['/']}>
        <Home {...stores} />
      </MemoryRouter>
    )

    // When
    const tree = component.toJSON()

    // Then
    expect(tree).toMatchSnapshot()
  })

  it(`should navigate to Home`, () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <Home {...stores} />
      </MemoryRouter>
    )
    const homeComponent = wrapper.find('Home')
    const navigateToHandler = jest.spyOn(homeComponent.instance(), 'navigateTo')
    wrapper.update()

    // When
    storage.set('DeploymentStore', { deploymentStep: 1 })
    homeComponent.find('.hm-Home_BtnNew').simulate('click')

    // Then
    expect(navigateToHandler).toHaveBeenCalledTimes(1)
    expect(navigateToHandler).toHaveBeenCalledWith('home')
  })

  // TODO: this tests should be working after reviewing / fixing issues with getCrowdsaleAssets method in Home component
  // it(`should navigate to StepOne`, () => {
  //   // Given
  //   const wrapper = mount(
  //     <MemoryRouter initialEntries={['/']}>
  //       <Home {...stores} />
  //     </MemoryRouter>
  //   )
  //   const homeComponent = wrapper.find('Home')
  //   const navigateToHandler = jest.spyOn(homeComponent.instance(), 'navigateTo')
  //   wrapper.update()
  //   storage.clearAll()
  //
  //   // When
  //   homeComponent.find('.hm-Home_BtnNew').simulate('click')
  //
  //   // Then
  //   expect(navigateToHandler).toHaveBeenCalledTimes(1)
  //   expect(navigateToHandler).toHaveBeenCalledWith('stepOne')
  // })

  it(`navigateTo should fail if receives invalid params`, () => {
    // Given
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <Home {...stores} />
      </MemoryRouter>
    )
    const homeComponent = wrapper.find('Home')
    const navigateToHandler = jest.spyOn(homeComponent.instance(), 'navigateTo')
    const invalidLocation = 'invalidLocation'

    // When
    const invalidLocationCall = () => navigateToHandler(invalidLocation)

    // Then
    expect(invalidLocationCall).toThrowError(`invalid location specified: ${invalidLocation}`)
  })
})
