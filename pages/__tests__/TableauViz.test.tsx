import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import TableauEmbedViz from '../components/TableauViz';

jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useRef: jest.fn(),
    useState: jest.fn(),
  };
});

describe('TableauEmbedViz', () => {
  let vizRefMock: { current: any };
  let setTableauVizMock: jest.Mock;
  let setIsVizLoadingMock: jest.Mock;
  let setIsExportingMock: jest.Mock;

  beforeEach(() => {
    vizRefMock = { current: { dispatchEvent: jest.fn() } };
    setTableauVizMock = jest.fn();
    setIsVizLoadingMock = jest.fn();
    setIsExportingMock = jest.fn();

    (useRef as jest.Mock).mockReturnValue(vizRefMock);
    (useState as jest.Mock).mockImplementation((initialValue: any) => [initialValue, jest.fn()]);
    (useState as jest.Mock)
      .mockImplementationOnce(() => [null, setTableauVizMock])
      .mockImplementationOnce(() => [true, setIsVizLoadingMock])
      .mockImplementationOnce(() => [{ pdf: false, csv: false }, setIsExportingMock]);
  });

  test('renders Tableau viz component', async () => {
    render(<TableauEmbedViz />);

    
    await waitFor(() => {
      expect(screen.getByText(/Exportar PDF/i)).toBeInTheDocument();
      expect(screen.getByText(/Exportar CSV/i)).toBeInTheDocument();
    });
  });

  test('displays loading state initially', async () => {
    render(<TableauEmbedViz />);

    await waitFor(() => {
      expect(screen.getByText(/Exportar PDF/i)).toBeDisabled();
      expect(screen.getByText(/Exportar CSV/i)).toBeDisabled();
    });
  });

  test('enables export buttons when viz is interactive', async () => {
    render(<TableauEmbedViz />);

    act(() => {
      vizRefMock.current.dispatchEvent(new Event('firstinteractive'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Exportar PDF/i)).not.toBeDisabled();
      expect(screen.getByText(/Exportar CSV/i)).not.toBeDisabled();
    });
  });

  test('export to PDF button triggers export function', async () => {
    render(<TableauEmbedViz />);

    act(() => {
      vizRefMock.current.dispatchEvent(new Event('firstinteractive'));
    });

    const exportPDFButton = await screen.findByText(/Exportar PDF/i);
    expect(exportPDFButton).not.toBeDisabled();

    userEvent.click(exportPDFButton);
    await waitFor(() => expect(exportPDFButton).toHaveTextContent('Exporting PDF...'));
  });

  test('export to CSV button triggers export function', async () => {
    render(<TableauEmbedViz />);

    act(() => {
      vizRefMock.current.dispatchEvent(new Event('firstinteractive'));
    });

    const exportCSVButton = await screen.findByText(/Exportar CSV/i);
    expect(exportCSVButton).not.toBeDisabled();

    userEvent.click(exportCSVButton);
    await waitFor(() => expect(exportCSVButton).toHaveTextContent('Exporting CSV...'));
  });
});
