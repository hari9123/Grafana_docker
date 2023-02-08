import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { selectors } from '@grafana/e2e-selectors';

import { NestedFolderItem } from '../service';

import { Props, SearchItem } from './SearchItem';

beforeEach(() => {
  jest.clearAllMocks();
});

const dashboardResult: NestedFolderItem = {
  uid: 'lBdLINUWk',
  title: 'Test 1',
  url: '/d/lBdLINUWk/test1',
  kind: 'dashboard',
  tags: ['Tag1', 'Tag2'],
};

const setup = (propOverrides?: Partial<Props>) => {
  const props: Props = {
    item: dashboardResult,
    onTagSelected: jest.fn(),
    editable: false,
  };

  Object.assign(props, propOverrides);

  render(<SearchItem {...props} />);
};

describe('SearchItem', () => {
  it('should render the item', () => {
    setup();
    expect(screen.getAllByTestId(selectors.components.Search.dashboardItem('Test 1'))).toHaveLength(1);
    expect(screen.getAllByText('Test 1')).toHaveLength(1);
  });

  it('should toggle items when checked', () => {
    const mockedOnToggleChecked = jest.fn();
    setup({ editable: true, onToggleChecked: mockedOnToggleChecked });
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(mockedOnToggleChecked).toHaveBeenCalledTimes(1);
    expect(mockedOnToggleChecked).toHaveBeenCalledWith(dashboardResult);
  });

  it('should mark items as checked', () => {
    setup({ editable: true, item: { ...dashboardResult }, isSelected: true });
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it("should render item's tags", () => {
    setup();
    expect(screen.getAllByText(/tag/i)).toHaveLength(2);
  });

  it('should select the tag on tag click', () => {
    const mockOnTagSelected = jest.fn();
    setup({ onTagSelected: mockOnTagSelected });
    fireEvent.click(screen.getByText('Tag1'));
    expect(mockOnTagSelected).toHaveBeenCalledTimes(1);
    expect(mockOnTagSelected).toHaveBeenCalledWith('Tag1');
  });
});
