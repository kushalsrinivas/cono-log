import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps, Text } from 'react-native';
import { AppColors } from '@/constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
}

export function Input({ label, helperText, error, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={AppColors.textMuted}
        {...props}
      />
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    color: AppColors.white,
  },
  input: {
    backgroundColor: AppColors.surfaceDark,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    height: 64,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '500',
    color: AppColors.white,
    outlineStyle: 'none',
  },
  inputError: {
    borderColor: AppColors.red,
  },
  helperText: {
    fontSize: 14,
    color: AppColors.textLight,
  },
  errorText: {
    fontSize: 14,
    color: AppColors.red,
  },
});

