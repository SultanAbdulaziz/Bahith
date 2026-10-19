"""timezone-aware timestamps

Revision ID: 6d39e4e9a545
Revises: 35825d4847fa
Create Date: 2026-10-19 15:22:44.420488

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '6d39e4e9a545'
down_revision: Union[str, Sequence[str], None] = '35825d4847fa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    for table, column, nullable in [("users", "created_at", False), ("videos", "created_at", False), ("videos", "started_at", True)]:
        op.alter_column(table, column, existing_type=postgresql.TIMESTAMP(), type_=sa.DateTime(timezone=True), existing_nullable=nullable)


def downgrade() -> None:
    """Downgrade schema."""
    for table, column, nullable in [("users", "created_at", False), ("videos", "created_at", False), ("videos", "started_at", True)]:
        op.alter_column(table, column, existing_type=sa.DateTime(timezone=True), type_=postgresql.TIMESTAMP(), existing_nullable=nullable)
