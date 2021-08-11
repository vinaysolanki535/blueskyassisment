const express = require('express')
const app = express()
const pool = require('./db')

app.use(express.json())

const host = '0.0.0.0'
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json('please complete the URL')
})

app.get('/countries', async (req, res) => {
  try {
    const allCountries = await pool.query(
      'SELECT DISTINCT country_or_area From green_house_data'
    )
    res.json(allCountries.rows)
  } catch (err) {
    console.log(err.message)
  }
})

function getParameter(perm) {
  let type
  if (perm == 'co2') {
    type =
      'carbon_dioxide_co2_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent'
  } else if (perm == 'greenhouse_gas') {
    type =
      'greenhouse_gas_ghgs_emissions_including_indirect_co2_without_lulucf_in_kilotonne_co2_equivalent'
  } else if (perm == 'hfcs') {
    type = 'hydrofluorocarbons_hfcs_emissions_in_kilotonne_co2_equivalent'
  } else if (perm == 'ch4') {
    type =
      'methane_ch4_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent'
  } else if (perm == 'nf3') {
    type = 'nitrogen_trifluoride_nf3_emissions_in_kilotonne_co2_equivalent'
  } else if (perm == 'n2o') {
    type =
      'nitrous_oxide_n2o_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent'
  } else if (perm == 'pfce') {
    type = 'perfluorocarbons_pfcs_emissions_in_kilotonne_co2_equivalent'
  } else if (perm == 'sf6') {
    type = 'sulphur_hexafluoride_sf6_emissions_in_kilotonne_co2_equivalent'
  }
  return type
}

app.get('/:country/:startYearOrPrem', async (req, res) => {
  let data
  try {
    if (Number.isInteger(parseInt(req.params.startYearOrPrem))) {
      data = await pool.query(
        `SELECT DISTINCT country_or_area, years,per_values ,category FROM green_house_data WHERE country_or_area = '${req.params.country}'  AND years = '${req.params.startYearOrPrem}'`
      )
    } else {
      let type = getParameter(req.params.startYearOrPrem)
      data = await pool.query(
        `SELECT DISTINCT country_or_area, years,per_values ,category FROM green_house_data WHERE country_or_area = '${req.params.country}'  AND category = '${type}'`
      )
    }
    res.json(data.rows)
  } catch (err) {
    console.log(err.message)
  }
})

app.get('/:country/:startYear/:endYear/:Parameter', async (req, res) => {
  try {
    let type = getParameter(req.params.Parameter)
    const data = await pool.query(
      `SELECT DISTINCT country_or_area, years,per_values ,category FROM green_house_data WHERE country_or_area = '${req.params.country}'  AND years BETWEEN '${req.params.startYear}' AND '${req.params.endYear}' AND category = '${type}'`
    )
    res.json(data.rows)
  } catch (err) {
    console.log(err.message)
  }
})

app.listen(port, host, () => {
  console.log('server is running on 3000')
})
