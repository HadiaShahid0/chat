import {
  setupMfaService,
  verifyMfaSetupService,
  disableMfaService,
} from "../../services/mfaServices.js";

export const setupMfa = async (req, res) => {
  try {
    const result = await setupMfaService(req.user.id);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const verifyMfaSetup = async (req, res) => {
  try {
    const { token } = req.body;

    const result = await verifyMfaSetupService(
      req.user.id,
      token,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const disableMfa = async (req, res) => {
  try {
    const result = await disableMfaService(req.user.id);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};