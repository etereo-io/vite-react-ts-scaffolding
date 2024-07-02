import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { SaleBundleTypes } from "@/bundles/bundles.types";
import { SectorTypes, ClientIdentityTypes, ClientGenderTypes } from "@/clients/clients.types";

import { FormValues, NewSaleFormProps } from "./types";

export default function NewSaleForm({ onSubmit, isLoading }: NewSaleFormProps) {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm<FormValues>();

  /**
   * Renders the bundle container with sector selection.
   *
   * @returns {JSX.Element} The bundle container component.
   */
  const renderBundleContainer = useMemo(
    () => (
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography fontWeight="medium" color="secondary">
          {t("forms.new_sale_form.bundle_info")}
        </Typography>
        <Controller
          name="client.sector"
          control={control}
          defaultValue={undefined}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="client-sector-label">{t("forms.new_sale_form.sector")}</InputLabel>
              <Select
                labelId="client-sector-label"
                id="client-sector"
                {...field}
                label={t("forms.new_sale_form.sector")}
                fullWidth
              >
                <MenuItem value="" disabled>
                  {t("forms.new_sale_form.select_sector")}
                </MenuItem>
                {Object.values(SaleBundleTypes).map((bundle) => (
                  <MenuItem key={bundle} value={bundle}>
                    {t(`forms.new_sale_form.bundle.${bundle}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>
    ),
    [control, t],
  );

  /**
   * Renders the client container with client information fields.
   *
   * @returns {JSX.Element} The client container component.
   */
  const renderClientContainer = useMemo(
    () => (
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography fontWeight="medium" color="secondary">
          {t("forms.new_sale_form.client_info")}
        </Typography>
        <Controller
          name="client.sector"
          control={control}
          defaultValue={undefined}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="client-sector-label">{t("forms.new_sale_form.sector")}</InputLabel>
              <Select
                labelId="client-sector-label"
                id="client-sector"
                {...field}
                label={t("forms.new_sale_form.sector")}
                fullWidth
              >
                <MenuItem value="" disabled>
                  {t("forms.new_sale_form.select_sector")}
                </MenuItem>
                {Object.values(SectorTypes).map((sector) => (
                  <MenuItem key={sector} value={sector}>
                    {t(`forms.new_sale_form.sector.${sector}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Box display="flex" gap={2}>
          <Controller
            name="client.dni"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label={t("forms.new_sale_form.document")} variant="outlined" fullWidth />
            )}
          />
          <Controller
            name="client.type"
            control={control}
            defaultValue={undefined}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="client-type-label">{t("forms.new_sale_form.identity_type")}</InputLabel>
                <Select
                  labelId="client-type-label"
                  id="client-type"
                  {...field}
                  label={t("forms.new_sale_form.identity_type")}
                  fullWidth
                >
                  {Object.values(ClientIdentityTypes).map((type) => (
                    <MenuItem key={type} value={type}>
                      {t(`forms.new_sale_form.identity_type.${type}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>
        <Box display="flex" gap={2}>
          <Controller
            name="client.firstName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label={t("forms.new_sale_form.first_name")} variant="outlined" fullWidth />
            )}
          />
          <Controller
            name="client.lastName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label={t("forms.new_sale_form.last_name")} variant="outlined" fullWidth />
            )}
          />
        </Box>
        <Controller
          name="client.gender"
          control={control}
          defaultValue={undefined}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="client-gender-label">{t("forms.new_sale_form.gender")}</InputLabel>
              <Select
                labelId="client-gender-label"
                id="client-gender"
                {...field}
                label={t("forms.new_sale_form.gender")}
                fullWidth
              >
                {Object.values(ClientGenderTypes).map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Controller
          name="client.country"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label={t("forms.new_sale_form.country")} variant="outlined" fullWidth />
          )}
        />
        <Controller
          name="client.language"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label={t("forms.new_sale_form.language")} variant="outlined" fullWidth />
          )}
        />
        <Controller
          name="client.phoneNumber"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label={t("forms.new_sale_form.phone_number")} variant="outlined" fullWidth />
          )}
        />
        <Controller
          name="client.emailAddress"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label={t("forms.new_sale_form.email_address")} variant="outlined" fullWidth />
          )}
        />
        <Controller
          name="client.physicalAddress"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label={t("forms.new_sale_form.physical_address")} variant="outlined" fullWidth />
          )}
        />
      </Box>
    ),
    [control, t],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {renderBundleContainer}
      <Divider sx={{ my: 4 }} />
      {renderClientContainer}
      <Box display="flex" flexDirection="column" gap={2} mt={4}>
        <Button type="submit" variant="contained" color="secondary" size="medium" disabled={isLoading}>
          {isLoading ? <CircularProgress variant={"indeterminate"} size={22} /> : t("forms.new_sale_form.submit")}
        </Button>
      </Box>
    </form>
  );
}
