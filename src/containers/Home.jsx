import PropTypes from 'prop-types'
import React from 'react'
import loadData from './hoc/load-data'
import gql from 'graphql-tag'
import { StyleSheet, css } from 'aphrodite'
import wrapMutations from './hoc/wrap-mutations'
import theme from '../styles/theme'
import { withRouter } from 'react-router'

const styles = StyleSheet.create({
  container: {
    marginTop: '5vh',
    textAlign: 'center',
    color: theme.colors.lightGray
  },
  content: {
    ...theme.layouts.greenBox
  },
  bigHeader: {
    ...theme.text.header,
    fontSize: 40
  },
  logoDiv: {
    ...theme.components.logoDiv
  },
  logoImg: {
    width: 120,
    ...theme.components.logoImg
  },
  header: {
    ...theme.text.header,
    marginBottom: 15,
    color: theme.colors.white
  },
  link_dark_bg: {
    ...theme.text.link_dark_bg
  }
})

class Home extends React.Component {
  state = {
    orgLessUser: false
  }

  componentWillMount() {
    const user = this.props.data.currentUser
    if (user) {
      if (user.adminOrganizations.length > 0) {
        this.props.router.push(`/admin/${user.adminOrganizations[0].id}`)
      } else if (user.texterOrganizations.length > 0) {
        this.props.router.push(`/app/${user.texterOrganizations[0].id}`)
      } else {
        this.setState({ orgLessUser: true })
      }
    }
  }

  // not sure if we need this anymore -- only for new organizations
  handleOrgInviteClick = async (e) => {
    if (!window.SUPPRESS_SELF_INVITE || window.SUPPRESS_SELF_INVITE === 'undefined') {
      e.preventDefault()
      const newInvite = await this.props.mutations.createInvite({
        is_valid: true
      })
      if (newInvite.errors) {
        alert('There was an error creating your invite')
        throw new Error(newInvite.errors)
      } else {
        // alert(newInvite.data.createInvite.id)
        this.props.router.push(`/login?nextUrl=/invite/${newInvite.data.createInvite.hash}`)
      }
    }
  }

  renderContent() {
    if (this.state.orgLessUser) {
      return (
        <div>
          <div className={css(styles.header)}>
            Thank you for signing up for Birddog!
          </div>
          <div>
            If you were sent a link by somebody to start texting, ask that person to send you the link to join their organization. Then, come back here and start texting! If are you trying to create a new account with Birddog, click here: 
            <!-- Load Stripe.js on your website. -->
<script src="https://js.stripe.com/v3"></script>

<!-- Create a button that your customers click to complete their purchase. Customize the styling to suit your branding. -->
<button
  style="background-color:#6772E5;color:#FFF;padding:8px 12px;border:0;border-radius:4px;font-size:1em"
  id="checkout-button-plan_Eu5B6PSvsJ6YzR"
  role="link"
>
  Checkout
</button>

<div id="error-message"></div>

<script>
  var stripe = Stripe('pk_live_2K9QoYqzZx4flhx9dVhyKqLe');

  var checkoutButton = document.getElementById('checkout-button-plan_Eu5B6PSvsJ6YzR');
  checkoutButton.addEventListener('click', function () {
    // When the customer clicks on the button, redirect
    // them to Checkout.
    stripe.redirectToCheckout({
      items: [{plan: 'plan_Eu5B6PSvsJ6YzR', quantity: 1}],

      // Note that it is not guaranteed your customers will be redirected to this
      // URL *100%* of the time, it's possible that they could e.g. close the
      // tab between form submission and the redirect.
      successUrl: 'https://birddoghq.com/success',
      cancelUrl: 'https://birddoghq.com/canceled',
    })
    .then(function (result) {
      if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer.
        var displayError = document.getElementById('error-message');
        displayError.textContent = result.error.message;
      }
    });
  });
</script>
          </div>
        </div>
      )
    }
    return (
      <div>
        <div className={css(styles.header)}>
        Birddog is a new way to reach real estate leads using text messaging.
        </div>
        <div>
          <a id='login' className={css(styles.link_dark_bg)} href='/login' onClick={this.handleOrgInviteClick}>Login and get started</a>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.logoDiv)}>
          <img
            src='https://bolsterhq.com/images/birddoglogo.png'
            className={css(styles.logoImg)}
          />
        </div>
        <div className={css(styles.content)}>
          {this.renderContent()}
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  mutations: PropTypes.object,
  router: PropTypes.object,
  data: PropTypes.object
}

const mapQueriesToProps = () => ({
  data: {
    query: gql` query getCurrentUser {
      currentUser {
        id
        adminOrganizations:organizations(role:"ADMIN") {
          id
        }
        texterOrganizations:organizations(role:"TEXTER") {
          id
        }
      }
    }`
  }
})

const mapMutationsToProps = () => ({
  createInvite: (invite) => ({
    mutation: gql`
        mutation createInvite($invite: InviteInput!) {
          createInvite(invite: $invite) {
            hash
          }
        }`,
    variables: { invite }
  })
})

export default loadData(wrapMutations(withRouter(Home)), { mapQueriesToProps, mapMutationsToProps })
